'use strict';

(function () {
  var google = require('googleapis');
  var OAuth2Client = google.auth.OAuth2;

  // Client ID and client secret are available at
  // https://code.google.com/apis/console
  var CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  var CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  var REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;

  var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

  var moment = require('moment');

  module.exports = {
    getUrl: function getUrl(email) {
      return oauth2Client.generateAuthUrl({
        access_type: 'offline', // will return a refresh token
        approval_prompt: 'force', // get the refresh token.
        scope: 'https://www.googleapis.com/auth/calendar.readonly',
        state: email
      });
    },

    setCredentialsFromCode: function setCredentialsFromCode(code, fn) {
      oauth2Client.getToken(code, function(err, tokens) {
        if (!err) {
          oauth2Client.setCredentials(tokens);
          fn(null, tokens);
        }
      });
    },

    getEventsFromCalendar: function getEventsFromCalendar(tokens, hours, fn) {
      // Set service level authentication.
      oauth2Client.setCredentials(tokens);
      var calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      // Get calendars where access is "owner".
      calendar.calendarList.list({ minAccessRole: 'owner' }, function(err, data) {
        if (!err) {
          var id = data.items[0].id;
          var hours = this;
          var params = {
            calendarId: id,
            timeMax: moment().add(hours, 'h').format(),
            timeMin: moment().format()
          };
          calendar.events.list(params, function(err, data) {
            var events = [];
            var id = this;
            for (var i = 0; i < data.items.length; i++) {
              if (data.items[i].description &&
                getPhoneNumbers(data.items[i].description)) {
                var ev = {
                  attendees: getPhoneNumbers(data.items[i].description),
                  startTime: data.items[i].start.dateTime || '',
                  calendarId: id
                };
                events.push(ev);
              }

              if (i == data.items.length - 1) {
                fn(null, events);
              }
            }
          }.bind(id));
        }
        fn(err, null);  // Return an error.
      }.bind(hours));
    },

    refreshAccessToken: function refreshAccessToken(tokens, fn) {
      // tokens:
      //  .access_token
      //  .refresh_token

      // First set tokens.
      oauth2Client.setCredentials(tokens);
      // Then see if they need to be refreshed.
      oauth2Client.refreshAccessToken(function(err, tokens) {
        console.log(tokens);
        if (!err) {
          fn(null, tokens);   // these are the new tokens.
        } else {
          fn(err, null);    // error.
        };
      });
    }
  };

  // Private methods.
  function getPhoneNumbers(text) {
    // Get formatted phone numbers.
    if (text && text.length > 0) {
      var phoneNumbers = new RegExp("\\+?\\(?\\d*\\)? ?\\(?\\d+\\)?\\d*([\\s./-]?\\d{2,})+", "g");
      if (text.match(phoneNumbers)) {
        return text.match(phoneNumbers).map(function(number) {
          return number.replace(/\D/g,'');
        });
      }
    }
  }
}());