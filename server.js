var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var JIFFServer = require('./lib/jiff-server');
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
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(sessions.sort( (a, b) => a.name > b.name ? 1 : 0)));
});

app.post('/session', function (req, res) {
  var name = req.body.name;
  var description = req.body.description;
  var participants = req.body.participants;
  createSession(name, description, participants);
  res.send(true);
});

app.put('/session', function (req, res) {
  var sessionArr = sessions.filter( s => s.id === req.body.id);
  if(sessionArr) {
    session = sessionArr[0];
    session.participants -= 1;
    if(session.participants == 0) {
      session.completed = true;
    }
    res.send(true);
  }
  else {
    res.send(false);
  }
});

// Serve static files.
app.use('/', express.static(path.join(__dirname)));
app.use('/lib', express.static(path.join(__dirname, 'lib')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/lib/ext', express.static(path.join(__dirname, 'lib', 'ext')));

// Seed data
createSession('KTH','For all KTH Royal Institute of Technology Students', 3);
createSession('Hanover', 'For all the residents of Hanover', 2);


http.listen(8080, function () {
  console.log('listening on *:8080');
});

console.log('Direct your browser to http://localhost:8080/demos/array-bubble-sort/client.html.');
console.log('To run a node.js based party: node demos/array-bubble-sort/party <input>');
console.log();

function createSession(name, description, participants) {
  var session = {
    id: uuidv4(),
    name: name,
    description: description,
    participants: participants,
    totalParticipants: participants,
    completed: false
  };
  sessions.push(session);
}

// https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array
function removeItemFromSessions(value) {
  var index = sessions.indexOf(value);
  if (index > -1) {
    sessions.splice(index, 1);
  }
}