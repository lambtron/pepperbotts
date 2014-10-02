require('./config/config');
var Google = require('./app/helpers/google');

var token = {
  access_token: 'ya29.kgBl4eEktfbg5F9w5PaiHcIFymxRS4lUSQ2hFWDfy-LLZS3o2zjNcE5m',
  refresh_token: '1/-HnUs61vZCnrYpdAZnzJmXJeYsWjhqMRCqGav8SKOj4'
};

// For each token, do this.
Google.refreshAccessToken(token, function(err, tokens) {
  // Save new tokens.
  Google.getEventsFromCalendar(token, 24, function(err, data) {
    if (!err && data && data.length > 0) {
      // iterate through data and put it all into Mongo database.
    }
  });
});


// Google.testRegex("asdfasdfsdf(301)208-1112afasdfsdfdssdf");

// { kind: 'calendar#calendarList',
//   etag: '"1412126649606000"',
//   nextSyncToken: '00001412126649606000',
//   items:
//    [ { kind: 'calendar#calendarListEntry',
//        etag: '"1408748625586000"',
//        id: 'andy@segment.io',
//        summary: 'Andy Jiang',
//        timeZone: 'America/Los_Angeles',
//        colorId: '17',
//        backgroundColor: '#9a9cff',
//        foregroundColor: '#000000',
//        selected: true,
//        accessRole: 'owner',
//        defaultReminders: [Object],
//        notificationSettings: [Object],
//        primary: true } ] }