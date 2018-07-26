require("dotenv").config();
var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var input = process.argv[3];
var nodeArgs = process.argv;
var inputName = "";

    

function searchName() {
    for(i = 3; i < nodeArgs.length; i++){
        if(inputName === ""){
            inputName = nodeArgs[i];
        } else if (command === "spotify-this-song") {
        inputName = inputName + " " + nodeArgs[i];
        } else if (command === "movie-this") {
            inputName = inputName + "+" + nodeArgs[i];
        }
    }
}
 

if(command === "my-tweets") {
    var params = {screen_name: 'deadbutton2'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        for(i=0; i < 20; i++) {
        console.log("==========================================================================================================")
        console.log("");
        console.log("Tweet:");
        console.log(tweets[i].text);
        console.log("");
        console.log("Tweeted at:");
        console.log(tweets[i].created_at);
        console.log("");
        }
      }
    });

} else if(command === "spotify-this-song") {
    searchName();
    console.log("=============" + inputName);

    // spotify
    // .search({ type: 'track', query: inputName })
    // .then(function(response) {
    //   console.log(response);
    // })
    // .catch(function(err) {
    //   console.log(err);
    // });


    spotify.search({ type: 'track', query: inputName }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        } else {
            console.log(data);
        }
    
    //   console.log("Artist: " + JSON.parse(data).Artist);
    //   console.log("Song: " + JSON.parse(data).Song);
    //   console.log("Album: " + JSON.parse(data).Album);
    //   console.log("Preview Link: " + JSON.parse(data).Preview);
      
      });
   
} else if(command === "movie-this") {
    searchName();
 
    var queryUrl = "http://www.omdbapi.com/?t=" + inputName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            console.log("Movie Title: " + JSON.parse(body).Title);
            console.log("Release Date: " + JSON.parse(body).Released);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].value);
            console.log("Country Produced: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
      });

} else if(command === "do-what-it-says"){
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
      
        // We will then print the contents of data
        console.log(data);
      
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
      
        // We will then re-display the content as an array for later use.
        console.log(dataArr);
      
      });
    //    * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.  
    //    * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.  
    //    * Feel free to change the text in that document to test out the feature for other commands.
} else {
    console.log("I'm sorry, your clearence level states you only have access to the 'my-tweets', 'spotify-this-song', 'movie-this' and 'do-what-it-says' commands.");
}