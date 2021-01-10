var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();
console.log('Command line arguments: <input> [<party count> [<computation_id> [<party id>]]]]');

var input = JSON.parse(process.argv[2]);
var party_count = process.argv[3];
var computation_id = process.argv[4];
var party_id = process.argv[5];

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('non-mpc-benchmark Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });
    
    function sendCompute() {
        if (connection.connected) {
            let options = {
                input: input,
                party_count: party_count,
                computation_id: computation_id,
                party_id: party_id
            };
            var data = JSON.stringify(options);
            connection.sendUTF(data);
        }
    }
    sendCompute();
});

client.connect('ws://localhost:8081/', 'non-mpc-benchmark');