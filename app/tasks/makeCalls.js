// This will go through database of events and make calls if the time
// is right.

// Declare environment variables.
require('../../config/config');

// Connect to db.
require('../lib/db_connect');
var mongoose = require('mongoose');

// Import helpers.
var Event = require('../models/event');
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
  var now = new moment();
  for (var i = 0; i < data.length; i++) {
    var ev = data[i];
    var meeting = moment(ev.startsAt);
    // If the time of the event is passed now.
    if (now.isAfter(meeting, 'minute') || now.isSame(meeting, 'minute'))
      Twilio.startConference(ev.calendarId, ev.twilio_number, ev.phone_numbers);

    // if (i == data.length - 1)
    //   mongoose.connection.close();
  }

  // if (data.length == 0)
  //   mongoose.connection.close();
});