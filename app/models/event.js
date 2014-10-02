'use strict';

(function () {

  var mongoose = require('mongoose')
    , Schema = mongoose.Schema
    , ObjectId = Schema.ObjectId;

  var EventSchema = new Schema({
      id: ObjectId,
      phone_numbers: Array,
      calendarId: String,
      datetime: Date
  });

  var Event = mongoose.model("Event", EventSchema);

  module.exports = {
    create: Event,

    upsertEvent: function (calendarId, datetime, phone_numbers) {
      var error = function(err) {
        if (err)
          throw err;
      };

      Event.update( {calendarId: calendarId, datetime: datetime}, {
        $set: {
          phone_numbers: phone_numbers
        }
      },
      {upsert: true},
      error);
    }
  };

}());