#/bin/bash

MAX_NUM_OF_CLIENTS=15
DELAYS_MS=(0 5 10 15 20 25 30)
CSV_OUTPUT_FILE="benchmark-$(date +"%N").csv"

TIMEFORMAT=%R
DOCKER_TAG=mpcbenchmark
DOCKER_CONTAINER_NAME="$DOCKER_TAG"
DOCKER_CLIENT_PARTY_CMD_PATH=src/array-bubble-sort/party.js

function startOneClient {
    RANDOM_NUMBER=$(( ( RANDOM % 1000 )  + 1 ))
    docker exec "$DOCKER_CONTAINER_NAME" node "$DOCKER_CLIENT_PARTY_CMD_PATH" "$RANDOM_NUMBER" "$1" "$2" > /dev/null;
}

function startNumberOfClients {
    # Generates 32 random chars
    COMPUTATION_ID=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)

    for i in $(seq 1 "$1"); do
        if [[ "$i" -eq "$1" ]]
        then
            result=$( { time startOneClient "$1" "$COMPUTATION_ID"; } 2>&1 )
            echo "$result"
        else
            startOneClient "$1" "$COMPUTATION_ID" &
        fi
    done
}

function runWithDelay {
    echo "Benchmark will start. Results are printed to stdout"
    echo "$1ms delay. "
    echo ""
    

    docker exec --user root mpcbenchmark tc qdisc add dev lo root netem delay "$1ms"

    for i in $(seq 1 "$MAX_NUM_OF_CLIENTS"); do
        executionTime=`startNumberOfClients "$i"`

        outline="$2;$i;$executionTime"
        outline=${outline//$'\n'/} # Remove all newlines in the output.
        echo "$outline" | tee -a "$CSV_OUTPUT_FILE"
    done

    docker exec --user root mpcbenchmark tc qdisc del dev lo root
    echo ""
    echo ""
}

echo "type;number of clients;time in seconds" | tee "$CSV_OUTPUT_FILE" > /dev/null


echo "Starting benchmark. You should not have the server running and be in the root folder!"
echo "Building docker container.."
docker build -q -t "$DOCKER_TAG" . > /dev/null

echo "Starting Node in docker without mpc. Will be killed on exit"
docker run --cap-add=NET_ADMIN --log-driver=none -d --rm --name="$DOCKER_CONTAINER_NAME" "$DOCKER_TAG" "node" "src-no-mpc/server.js" > /dev/null
DOCKER_CLIENT_PARTY_CMD_PATH="src-no-mpc/client.js"
trap "docker rm -f $DOCKER_CONTAINER_NAME > /dev/null; exit;" EXIT SIGINT

echo "Waiting 15 sec for container to start"
sleep 15

for delay in "${DELAYS_MS[@]}"; do
    runWithDelay "$delay" "no-mpc_${delay}-ms"
done



docker rm -f "$DOCKER_CONTAINER_NAME" > /dev/null
echo "Starting Node in docker with mpc. Will be killed on exit"
docker run --cap-add=NET_ADMIN --log-driver=none -d --rm --name="$DOCKER_CONTAINER_NAME" "$DOCKER_TAG" > /dev/null
trap "docker rm -f $DOCKER_CONTAINER_NAME > /dev/null; exit;" EXIT SIGINT
DOCKER_CLIENT_PARTY_CMD_PATH="src/array-bubble-sort/party.js"
echo "Waiting 15 sec for container to start"
sleep 15

for delay in "${DELAYS_MS[@]}"; do
    runWithDelay "$delay" "mpc_${delay}-ms"
done
