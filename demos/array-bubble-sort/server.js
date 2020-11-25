var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var JIFFServer = require('../../lib/jiff-server');
new JIFFServer(http, { logs:true });
const { v4: uuidv4 } = require('uuid');
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

var sessions = [];

// API routes
app.get('/session', function (req, res) {
  res.send(sessions);
});

app.post('/session', function (req, res) {
  var description = req.body.description;
  var participants = req.body.participants;
  createSession(description, participants);
  res.send(true);
});

// Serve static files.
app.use('/demos', express.static(path.join(__dirname, '..', '..', 'demos')));
app.use('/dist', express.static(path.join(__dirname, '..', '..', 'dist')));
app.use('/lib/ext', express.static(path.join(__dirname, '..', '..', 'lib', 'ext')));

// Seed data
createSession('Stockholm', 5);
createSession('Hanover', 3);
createSession('Bangalore', 6);


http.listen(8080, function () {
  console.log('listening on *:8080');
});

console.log('Direct your browser to http://localhost:8080/demos/array-bubble-sort/client.html.');
console.log('To run a node.js based party: node demos/array-bubble-sort/party <input>');
console.log();

function createSession(description, participants) {
  var session = {
    id: uuidv4(),
    description: description,
    participants: participants
  };
  sessions.push(session);
}