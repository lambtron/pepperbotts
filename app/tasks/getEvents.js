// This will go through all users and retrieve
// events within the next 24 hrs from their calendars.

// Declare environment variables.
require('./config/config');

// Connect to db.
require('./app/lib/db_connect');

// Import helpers.
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Event = mongoose.model('Event');
var Google = require('../helpers/google');

User.create.find({}).exec(function(err, data) {
  // Go through each user.
  for (var i = 0; i < data.length; i ++) {
    var token = {
      access_token: data[i].google_access_token,
      refresh_token: data[i].google_refresh_token
    };

    var user = {
      email: data[i].email,
      twilio_number: data[i].phone_number
    };

    // For each token, do this.
    Google.refreshAccessToken(token, function(err, token) {
      var user = this;

      // Save new tokens.
      User.upsertUser(user.email, token.refresh_token, token.access_token,
        token.expiry_date);

      Google.getEventsFromCalendar(token, 24, function(err, data) {
        if (!err && data && data.length > 0) {
          // iterate through data and put it all into Event mongo.
          data.forEach(function(ev) {
            Event.upsertEvent(user.email, ev.startTime, ev.attendees,
              user.twilio_number);
          });
        }
      }.bind(user));
    }.bind(user));
  }
});