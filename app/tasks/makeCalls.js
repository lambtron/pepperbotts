// This will go through database of events and make calls if the time
// is right.

// Declare environment variables.
require('./config/config');

// Connect to db.
require('./app/lib/db_connect');

// Import helpers.
var mongoose = require('mongoose');
var Event = mongoose.model('Event');
var Google = require('../helpers/google');
var Twilio = require('../helpers/twilio');
var moment = require('moment');

// Initiate outbound calls to each of them.
var now = new Date(moment());
var later = new Date(moment().add(1, 'h')); // 1 hr into the future.

Event.create.find(
  {
    "startsAt" :
      {
        "$gte": now,
        "$lte": later
      }
  }
)
.exec(function(err, data) {
  data.forEach(function(ev) {
    // If the time of the event is passed now.
    var now = new moment();
    var meeting = moment(ev.datetime);
    if (now.isAfter(meeting, 'minute') || now.isSame(meeting, 'minute')
      Twilio.startConference(ev.calendarId, ev.twilio_number, ev.phone_numbers);
  });
});