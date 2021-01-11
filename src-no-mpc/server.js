var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
  // process HTTP request. Since we're writing just WebSockets
  // server we don't have to implement anything.
});
server.listen(8081, function() { });

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

var connections = [];

// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept('non-mpc-benchmark', request.origin);

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      // process WebSocket message
      console.log(message)
      let data = JSON.parse(message.utf8Data);
      let client = {
        data: data,
        connection: connection
      };
      connections.push(client);
      if(connections.length == data.party_count) {
        sendSortedData();
      }
    }
  });

  connection.on('close', function(connection) {
    // close user connection
    connections = [];
  });
});

function sendSortedData() {
  let data_array = connections.map(c => c.data);
  let inputs_array = data_array.map(d => d.input);
  
  let sortedArray = average(inputs_array);

  connections.forEach(client => {
    let jsonData = JSON.stringify(sortedArray);
    client.connection.sendUTF(jsonData);
  });
}

function average(inputArr) {
  var sum = inputArr.reduce((a, b) => a + b, 0);
  return (sum / inputArr.length)
}