'use strict';

(function() {
  // Import helpers ============================================================
  var Google = require('../app/helpers/google');

  // Public functions. =========================================================
  module.exports = function (app) {
    // API routes. =============================================================
    app.post('/api/oauth', function (req, res) {
      // Make request to Google.
      var url = Google.getUrl();
      res.send({url: url}, 200);
    });

    app.post('/oauth2callback', function (req, res) {
      console.log(req);
    });

  	// Application routes ======================================================
  	app.get('/*', function (req, res) {
      res.sendfile('index.html', {'root': './public/views/'});
    });
  };

}());