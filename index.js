const twit = require('twit');

const config = {
    // export twitter_consumer_key=your_key_here
    consumer_key: process.env.twitter_consumer_key,
    consumer_secret: process.env.twitter_consumer_secret,
    access_token: process.env.twitter_access_token,
    access_token_secret: process.env.twitter_access_token_secret
}
const Twitter = new twit(config);

var users = ["984436559335260160", "352093320", "3158277781", "905575675624660993", "105562852", "714289913823277056", "1921429580", "1192134402098237444", "202285636"]; 
var keywords = ["SFO", "San Francisco", "OAK", "Oakland", "SJC", "San Jose"];
var i;

var stream = Twitter.stream('statuses/filter', {follow: users});
stream.on('tweet', function (tweet) {
    if (users.indexOf(tweet.user.id_str) > -1) {
        for(i =0; i < keywords.length; i++){
            if(tweet.text.includes(keywords[i])){
                console.log(tweet.user.name + ": " + tweet.text);
                Twitter.post('statuses/retweet/:id', { id: tweet.id_str }, function (err, data, response) {
                    console.log(data)
                    console.log(err);
                    
                })
                break;
            }
        }
    }
})

let retweetOldTweets = function() {
    let params = {
        q: '%28SFO%20OR%20OAK%20OR%20SJC%20OR%20oakland%20OR%20%22san%20jose%22%20OR%20%22san%20francisco%22%29%20%28from%3ATheFlightDeal%20OR%20from%3AFlightAlertDeal%20OR%20from%3Aflightdealrss%20OR%20from%3A2thriftytravel%20OR%20from%3ADynamiteTravel%20OR%20from%3ADriftrTravels%20OR%20from%3Algwflightdeals%20OR%20from%3Ajoinflyline%20OR%20from%3AlatestBFDeals%29',
        result_type: 'mixed',
        lang: 'en',
        count: '100',

    }
    Twitter.get('search/tweets', params, function(err, data) {
        // if there is no error
        if (!err) {
           // loop through the first 4 returned tweets
          for (let i = 0; i < data.statuses.length; i++) {
            // iterate through those first four defining a rtId that is equal to the value of each of those tweets' ids
          let rtId = data.statuses[i].id_str;
            // the post action
          Twitter.post('statuses/retweet/:id', {
            // setting the id equal to the rtId variable
            id: rtId
            // log response and log error
          }, function(err, response) {
            if (response) {
              console.log('Successfully retweeted');
            }
            if (err) {
              console.log(err);
            }
          });
        }
      }
        else {
            // catch all log if the search could not be executed
          console.log('Could not search tweets.');
        }
    });
}
retweetOldTweets();
setInterval(retweetOldTweets, 600000);