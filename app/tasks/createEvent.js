// This will go through all users and retrieve
// events within the next 24 hrs from their calendars.

// Declare environment variables.
require('../../config/config');

// Connect to db.
require('../lib/db_connect');
var mongoose = require('mongoose');

// Import helpers.
var Event = require('../models/event');

Event.upsertEvent("andyjiang@gmail.com", "", ["2409887757"], "2409887757");