// This will go through all users and retrieve
// events within the next 24 hrs from their calendars.

// Declare environment variables.
require('../../config/config');

// Connect to db.
require('../lib/db_connect');
var mongoose = require('mongoose');

// Import helpers.
var User = require('../models/user');
var Event = require('../models/event');
var Google = require('../helpers/google');

User.create.find({}).exec(function(err, data) {
  console.log(data);
  // Go through each user.
  for (var i = 0; i < data.length; i ++) {
    var token = {
      access_token: data[i].google_access_token,
      refresh_token: data[i].google_refresh_token
    };

    var user = {
      email: data[i].email,
      twilio_number: data[i].twilio_number,
      refresh_token: data[i].google_refresh_token
    };

    // For each token, do this.
    Google.refreshAccessToken(token, function(err, new_token) {
      var user = this;
      // Save new tokens.
      User.upsertUser(user.email, new_token.refresh_token, new_token.access_token,
        new_token.expiry_date, user.twilio_number);

      Google.getEventsFromCalendar(new_token, 24, function(err, data) {
        console.log('events:');
        console.log(data);
        if (!err && data && data.length > 0) {
          // iterate through data and put it all into Event mongo.
          for (var i = 0; i < data.length; i ++) {
            var ev = data[i];
            console.log('event is being upserted');
            console.log(Event);
            console.log(Event.upsertEvent);
            Event.upsertEvent(user.email, ev.startTime, ev.attendees,
              user.twilio_number);

            if (i == data.length - 1)
              mongoose.connection.close();
          }
        } else {
          mongoose.connection.close();
        }
      }.bind(user));
    }.bind(user));
  }
});