// This will go through database of events and make calls if the time
// is right.

// Declare environment variables.
require('./config/config');

// Connect to db.
require('./app/lib/db_connect');

// Import helpers.
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Event = mongoose.model('Event');
var Google = require('../helpers/google');

// Get all events in database that is less than an hour out.

// Initiate outbound calls to each of them.
