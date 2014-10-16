// This will go through all users and retrieve
// events within the next 24 hrs from their calendars.

// Declare environment variables.
require('../../config/config');

// Connect to db.
require('../lib/db_connect');
var mongoose = require('mongoose');

// Import helpers.
var Event = require('../models/event');

console.log(Event);

Event.upsertEvent("andyjiang@gmail.com", "2014-10-16T02:00:00-07:00", [],
              "2409887757");