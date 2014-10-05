'use strict';

(function () {

  var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

  var EventSchema = new Schema({
      id: ObjectId,
      phone_numbers: Array,
      calendarId: String,
      startsAt: Date,
      twilio_number: String
  });

  var Event = mongoose.model("Event", EventSchema);

  module.exports = {
    create: Event,

    upsertEvent: function (calendarId, startsAt, phone_numbers, twilio_number) {
      var error = function(err) {
        if (err)
          throw err;
      };

      Event.update( {calendarId: calendarId, startsAt: startsAt}, {
        $set: {
          phone_numbers: phone_numbers,
          twilio_number: twilio_number
        }
      },
      {upsert: true},
      error);
    }
  };

}());