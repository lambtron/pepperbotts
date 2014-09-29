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

  module.exports = {
    getUrl: function getUrl() {
      return oauth2Client.generateAuthUrl({
        access_type: 'offline', // will return a refresh token
        scope: 'https://www.googleapis.com/auth/calendar.readonly'
      });
    },
    setCredentials: function setCredentials(code) {
      oauth2Client.getToken(code, function(err, tokens) {
        if (!err)
          oauth2Client.setCredentials(tokens);

        // Also save the credentials in Mongo.
        console.log(tokens);
      });
    }
  };

}());