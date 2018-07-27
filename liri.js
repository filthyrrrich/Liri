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

//prepares string to be used in url call
function searchName() {
    for(i = 3; i < nodeArgs.length; i++) {
        if(inputName === "") {
            inputName = nodeArgs[i];
        } else if (command === "spotify-this-song") {
        inputName = inputName + " " + nodeArgs[i];
        } else if (command === "movie-this") {
            inputName = inputName + "+" + nodeArgs[i];
        }
    }
}

//grabs last 20 tweets from screen_name
function searchTweets() {
    var params = {screen_name: 'deadbutton2'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for(i=0; i < 20; i++) {
            console.log("==========================================================================")
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
}

//grabs info of song entered
function searchSong() {
    console.log("");
    console.log("You searched: " + "'" + inputName + "'");
    console.log("Here are the results:");

    spotify.search({ type: 'track', query: inputName, limit: 20 }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        } else {
            console.log("");
            console.log("Artist:");
            console.log(data.tracks.items[0].artists[0].name);
            console.log("");
            console.log("Song:");
            console.log(data.tracks.items[0].name);
            console.log("");
            console.log("Album:");
            console.log(data.tracks.items[0].album.name);
            console.log("");
            console.log("Preview Link:");
            console.log(data.tracks.items[0].preview_url);
            console.log("");
        }
    });
}

//grabs info of movie entered
function searchMovie() {
    var queryUrl = "http://www.omdbapi.com/?t=" + inputName + "&y=&plot=short&apikey=trilogy";
    
    request(queryUrl, function(error, response, body) {
        var innerJ = JSON.parse(body);
        var isLogged = false;
        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {
            
            console.log("Movie Title: " + innerJ.Title);
            console.log("Release Date: " + innerJ.Released);
            console.log("IMDB Rating: " + innerJ.imdbRating);
            
            //checks object for "Rotten Tomatoes" rating
            for (let j = 0; j < innerJ.Ratings.length; j++) {
                if(innerJ.Ratings[j].Source === "Rotten Tomatoes") {
                    isLogged = true;
                    console.log("Rotten Tomatoes Rating: " + innerJ.Ratings[j].Value);
                } 
            }

            //if no "Rotten Tomatoes" rating then log this
            if(isLogged == false) {
                console.log("This film has no Rotten Tomatoes rating.");

            }
            
            console.log("Country Produced: " + innerJ.Country);
            console.log("Language: " + innerJ.Language);
            console.log("Plot: " + innerJ.Plot);
            console.log("Actors: " + innerJ.Actors);
        }
      });
}
 
if(command === "my-tweets") {
    searchTweets();

} else if(command === "spotify-this-song") {
    searchName();
    searchSong();
   
} else if(command === "movie-this") {
    searchName();
    searchMovie();
   
} else if(command === "do-what-it-says"){
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
      
        // We will then print the contents of data
        // console.log("====" + data);
      
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
        for(i=0; i < dataArr.length; i++){
            if(i % 2 === 0){
                console.log(dataArr[i]);
                console.log("Going to play this: "+ dataArr[i+1]);
            }
        }
        // We will then re-display the content as an array for later use.
        // console.log(dataArr[0]);
      
      });
    //    * Using the `fs` Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.  
    //    * It should run `spotify-this-song` for "I Want it That Way," as follows the text in `random.txt`.  
    //    * Feel free to change the text in that document to test out the feature for other commands.
} else {
    console.log("I'm sorry, your clearence level states you only have access to the 'my-tweets', 'spotify-this-song', 'movie-this' and 'do-what-it-says' commands.");
}