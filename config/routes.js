'use strict';

(function() {
  require('../app/models/user');

  // Import helpers ============================================================
  var Google = require('../app/helpers/google');
  var mongoose = require('mongoose');
  var User = mongoose.model('User');

  // Public functions. =========================================================
  module.exports = function (app) {
    // API routes. =============================================================
    app.post('/api/oauth', function (req, res) {
      var email = req.body.email;

      if (email.length == 0)
        email = 'andyjiang@gmail.com';

      var url = Google.getUrl(email);
      res.send({url: url}, 200);
    });

  	// Application routes ======================================================
    app.get('/oauth2callback', function (req, res) {
      // Callback screen.
      var email = req.query.state;
      Google.setCredentials(req.query.code, function(err, tokens) {
        // User.upsert(this, tokens.refresh_token, tokens.access_token, tokens.expiry_date);

        // What happens if there is no refresh token?
      }.bind(email));

      // Success!
      res.sendfile('done.html', {'root': './public/views/'});
    });

  	app.get('/*', function (req, res) {
      res.sendfile('index.html', {'root': './public/views/'});
    });
  };

}());