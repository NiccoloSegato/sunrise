// Client ID and API key from the Developer Console
const CLIENT_ID = '33459553959-3sp46tvadtnpcmq0u1q5rt2abivaankl.apps.googleusercontent.com';
const API_KEY = 'AIzaSyA9I6_14LdmbreTRCHVvXiDsgUC2jP04V4';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest", "https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest", "https://www.googleapis.com/discovery/v1/apis/plus/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = "https://www.googleapis.com/auth/tasks.readonly https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/plus.me";

const authorizeButton = document.getElementById('authorize_button');
const signoutButton = document.getElementById('signout_button');

$(document).ready(function(){
  handleClientLoad()
}) 

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  }, function(error) {
    console.log(JSON.stringify(error, null, 2));
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listUpcomingEvents();
    listTaskLists();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPreCal(message, location, time_lbl) {
  var pre = document.getElementById('calendar');

  var div = document.createElement("div");
  div.className = "event-div"

  var name = document.createElement("p");
  name.className = "event-name"
  name.innerHTML = message + '\n'

  var loc = document.createElement("p");
  loc.className = "event-location"
  loc.innerHTML = location + '\n'

  var time = document.createElement("p");
  time.className = "event-time"
  time.innerHTML = time_lbl + "\n"

  div.appendChild(name)
  div.appendChild(time)
  div.appendChild(loc)
  pre.appendChild(div);
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPreTasks(message, due) {
  var pre = document.getElementById('tasks');

  var div = document.createElement('div');
  div.className = 'tasks-div'

  var circle = document.createElement('div');
  circle.className = 'shape-circle'

  var node = document.createElement('p')
  node.innerHTML = message
  node.className = "task-name"

  var due_lbl = document.createElement('p')
  due_lbl.innerHTML = due
  due_lbl.className = "task-due"

  div.appendChild(circle)
  div.appendChild(node)
  div.appendChild(due_lbl)
  pre.appendChild(div);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    'timeMin': (new Date()).toISOString(),
    'showDeleted': false,
    'singleEvents': true,
    'maxResults': 10,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items;

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        var end = event.end.dateTime;

        if(when){
          var when_short = when.slice(0,10)
          var when_time = when.slice(11, 16)
          var end_time = end.slice(11, 16)
          var finalTime = when_time + ' - ' + end_time
          if(when_short == today){
            appendPreCal(event.summary, event.location, finalTime)
            console.log(event.summary + ' (' + when_short + ')')
          }
        }

        if (!when) {
          when = event.start.date;
          if(when == today){
            var stringa = 'TUTTO IL GIORNO'
            appendPreCal(event.summary, event.location, stringa)
            console.log(event.summary + ' (' + when + ')')
          }
        }
        
      }
    } else {
      document.getElementById("calendar").style.display = 'none'
    }
  });
}

function listTaskLists() {
  gapi.client.tasks.tasks.list({
      'tasklist': 'MTE5MTA2Mzg4ODE3MTQ5NzUyMzQ6MDow'
    }).then(function (response) {
        var taskLists = response.result.items;
        for (var i = 0; i < taskLists.length; i++) {
            var taskList = taskLists[i];
            if(taskList.due){
              var when = taskList.due;
              var when_short = when.slice(0,10)
              var when_time = when.slice(11, 16)
              if(when_time == '00:00'){
                appendPreTasks(taskList.title, when_short);
              }
              else{
                appendPreTasks(taskList.title, when_short + ' - ' + when_time);
              }
              
            }
        }
    });
}