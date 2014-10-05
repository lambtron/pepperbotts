'use strict';

(function () {

  var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

  var UserSchema = new Schema({
      id: ObjectId,
      phone_number: String,
      email: String,
      google_access_token: String,
      google_refresh_token: String,
      google_expiry: Date
  });

  var User = mongoose.model("User", UserSchema);

  module.exports = {
    create: User,

    upsertUser: function (email, google_refresh_token, google_access_token, google_expiry, phone_number) {
      var error = function(err) {
        if (err)
          throw err;
      };

      User.update( {email: email}, {
        $set: {
          google_refresh_token: google_refresh_token,
          google_access_token: google_access_token,
          google_expiry: google_expiry,
          phone_number: phone_number
        }
      },
      {upsert: true},
      error);
    }
  };

}());