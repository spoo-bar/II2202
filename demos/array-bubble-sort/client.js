var backendUrl = "http://localhost:8080";
var sessions = [];

$('#inputView').toggle();
/**
 * Do not modify this file unless you have too
 * This file has UI handlers.
 */
// eslint-disable-next-line no-unused-vars
function connect() {
  $('#connectButton').prop('disabled', true);
  var computation_id = $('#sessions option:selected').val();
  var selected_session = $('#sessions option:selected').text();
  var party_count = parseInt(sessions.filter(function (session) { return session.id === computation_id; })[0].participants);

  if (isNaN(party_count)) {
    $('#output').append("<p class='error'>Party count must be a valid number!</p>");
    $('#connectButton').prop('disabled', false);
  } else {
    var options = { party_count: party_count };
    options.onError = function (_, error) {
      $('#output').append("<p class='error'>" + error + '</p>');
    };
    options.onConnect = function () {
      $('#processButton').attr('disabled', false); $('#output').append('<p>All parties Connected!</p>');
      //toggleSessionInput();
    };

    var hostname = window.location.hostname.trim();
    var port = window.location.port;
    if (port == null || port === '') {
      port = '80';
    }
    if (!(hostname.startsWith('http://') || hostname.startsWith('https://'))) {
      hostname = 'http://' + hostname;
    }
    if (hostname.endsWith('/')) {
      hostname = hostname.substring(0, hostname.length - 1);
    }
    if (hostname.indexOf(':') > -1 && hostname.lastIndexOf(':') > hostname.indexOf(':')) {
      hostname = hostname.substring(0, hostname.lastIndexOf(':'));
    }

    hostname = hostname + ':' + port;
    // eslint-disable-next-line no-undef
    mpc.connect(hostname, computation_id, options);
  }
}

// eslint-disable-next-line no-unused-vars
function submit() {
  var arr = [];
  arr.push(parseInt(document.getElementById('inputText').value));

  for (var i = 0; i < arr.length; i++) {
    if (typeof (arr[i]) !== 'number') {
      alert('Please input an array of integers.');
      return;
    }
  }

  $('#processButton').attr('disabled', true);
  $('#output').append('<p>Starting...</p>');

  // eslint-disable-next-line no-undef
  var promise = mpc.compute(arr);
  promise.then(handleResult);
}

// eslint-disable-next-line no-unused-vars
function handleResult(result) {
  $('#output').append('<p>Result is: ' + result + '</p>');
  $('#button').attr('disabled', false);
}

function toggleSessionInput() {
  $('#session').toggle();
  $('#inputView').toggle();
}

function getRegisteredSessions() {
  var url = backendUrl + '/session';
  $.get(url, function (response, status) {
    sessions = [];
    sessions.push(...response);
    $.each(sessions, function (index, value) {
      $('#sessions').append($('<option/>', {
        value: value.id,
        text: value.description
      }));
    });
  });
}

function createSession() {
  var url = backendUrl + '/session';
  var session_description = $('#session-description').val()
  var party_count = parseInt($('#count').val());
  var session = {
    description: session_description,
    participants: party_count
  };
  $.post(url, session, function(response, status) {
    window.location.reload(true); 
  });
}

getRegisteredSessions();