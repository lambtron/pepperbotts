'use strict';

(function () {
  //require the Twilio module and create a REST client
  var client = require('twilio')(process.env.TWILIO_ASID,
    process.env.TWILIO_AUTH_TOKEN);
  var twimlBuilder = require('twilio');

  // Send an SMS text message
  module.exports = {
    sendMessage: function(to, from, body) {
      client.sendMessage({
        to: to,
        from: from,
        body: body
      }, function(err, responseData) {
        if (!err) {
          // console.log(responseData);
        } else {
          console.log('Twilio error: ' + err);
        }
      });
    },
    standardizePhoneNumber: function(phone_number) {
      // 2409887757 to +12409887757
      var new_phone_number = phone_number + '';
      if (new_phone_number.length == 10 || new_phone_number.substring(0,2) != '+1') {
        new_phone_number = '+1' + new_phone_number;
      };
      return new_phone_number;
    },
    startConference: function(name, twilio_number, phone_numbers) {
      twilio_number = standardizePhoneNumber(twilio_number);

      phone_numbers.forEach(function(phone_number) {
        phone_number = standardizePhoneNumber(phone_number);
        client.calls.create({
          url: "http://pepperbotts.herokuapp.com/conference?name=" + name,
          to: phone_number,
          from: twilio_number
        }, function(err, call) {
          console.log(err);
        });
      })
    },
    getConferenceTwiml: function(name) {
      var twiml = new twimlBuilder.TwimlResponse();
      twiml.say('Your conference call is starting.', {
        voice: 'woman',
        language: 'en-gb'
      })
      .dial(function(node) {
        node.conference(name);
      });
      return twiml.toString();
    }
  };
}());