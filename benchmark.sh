#/bin/bash

MAX_NUM_OF_CLIENTS=15

TIMEFORMAT=%R

function startOneClient {
    RANDOM_NUMBER=$(( ( RANDOM % 1000 )  + 1 ))
    node src/array-bubble-sort/party.js "[$RANDOM_NUMBER]" "$1" "$2" > /dev/null;
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

echo "Starting benchmark. You should not have the server running and be in the root folder!"

echo "Starting Node. Will be killed on exit"
node index.js > /dev/null &
NODE_PID=$!
trap "kill $NODE_PID; exit;" EXIT SIGINT

echo "Waiting 15 sec"
sleep 15

echo "Benchmark will start. Results are printed to stdout"
echo ""
echo ""
echo "number of clients;time in seconds"
for i in $(seq 1 "$MAX_NUM_OF_CLIENTS"); do 
    executionTime=`startNumberOfClients "$i"`

    outline="$i;$executionTime"
    outline=${outline//$'\n'/} # Remove all newlines in the output.
    echo "$outline"
done
