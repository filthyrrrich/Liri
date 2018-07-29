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
var inputNameStandard = "";

//prepares string to be used in url call
function searchName() {
    for(i = 3; i < nodeArgs.length; i++) {
        if(inputName === "") {
            inputName = nodeArgs[i];
            inputNameStandard = nodeArgs[i];
        } else if (command === "spotify-this-song") {
            inputName = inputName + " " + nodeArgs[i];
        } else if (command === "movie-this") {
            inputName = inputName + "+" + nodeArgs[i];
            inputNameStandard = inputNameStandard + " " + nodeArgs[i];
        }
    }
}

//grabs last 20 tweets from screen_name
function searchTweets() {
    var params = {screen_name: 'deadbutton2'};

    //displays name of twitter account
    console.log("============================================================================");
    console.log("");
    console.log("");
    console.log("               Here are the last 20 tweets from: " + params.screen_name);
    console.log("");
    console.log("");

    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for(i=0; i < 20; i++) {
            console.log("");
            console.log("Tweet:");
            console.log(tweets[i].text);
            console.log("");
            console.log("Tweeted at:");
            console.log(tweets[i].created_at);
            console.log("");
            console.log("============================================================================");
            }
        }
    });
}

//grabs info of song entered
function searchSong() {
    //displays what you searched
    console.log("============================================================================");
    console.log("");
    console.log("You searched: " + "'" + inputName + "'");
    console.log("");
    
    //default search
    if (!input && command === "spotify-this-song"){
        inputName = "Ace of Base";
    }

    //grabs song info from spotify
    spotify.search({ type: 'track', query: inputName, limit: 20 }, function(err, data) {
        if (err) {
            console.log("I couldn't find what you were looking for. Try checking the spelling and search again.");
            console.log("");
            console.log("============================================================================");
            
        } else {
            //displays song info
            console.log("");
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("");
            console.log("Song: " + data.tracks.items[0].name);
            console.log("");
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("");
            console.log("Preview Link:");
            console.log(data.tracks.items[0].preview_url);
            console.log("");
            console.log("============================================================================");
        }
    });
}

//grabs info of movie entered
function searchMovie() {
    //default search
    if (!input){
        inputName = "Mr Nobody";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + inputName + "&y=&plot=short&apikey=trilogy";
    
    //displays what you searched
    console.log("============================================================================");
    console.log("");
    console.log("You searched: " + "'" + inputNameStandard + "'");
    console.log("");

    //grabs info from omdb
    request(queryUrl, function(error, response, body) {
        var innerJ = JSON.parse(body);
        var isLogged = false;
        
        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200 && innerJ.Title != undefined) {
            //displays movie info
            console.log("");
            console.log("Movie Title: " + innerJ.Title);
            console.log("");
            console.log("Release Date: " + innerJ.Released);
            console.log("");
            console.log("IMDB Rating: " + innerJ.imdbRating);
            console.log("");

            //checks object for "Rotten Tomatoes" rating
            for (let j = 0; j < innerJ.Ratings.length; j++) {
                if(innerJ.Ratings[j].Source === "Rotten Tomatoes") {
                    isLogged = true;
                    console.log("Rotten Tomatoes Rating: " + innerJ.Ratings[j].Value);
                    console.log("");
                } 
            }

            //if no "Rotten Tomatoes" rating then log this
            if(isLogged == false) {
                console.log("This film has no Rotten Tomatoes rating.");
                console.log("");
            }
            
            //displays movie info
            console.log("Country Produced: " + innerJ.Country);
            console.log("");
            console.log("Language: " + innerJ.Language);
            console.log("");
            console.log("Plot: " + innerJ.Plot);
            console.log("");
            console.log("Actors: " + innerJ.Actors);
            console.log("");
            console.log("============================================================================");
            
        } else {
            //if search yeilds undefined title
            console.log("");
            console.log("I couldn't find what you were looking for. Try checking the spelling and search again.")
            console.log("");
            console.log("============================================================================");
        }
    });
}

function searchTxt() {
    //reads random.txt and returns data
    fs.readFile("random.txt", "utf8", function(error, data) {
        
        // splits by commas (to make it more readable)
        var dataArr = data.split(",");
        
        if (error) {
          return console.log(error);
        }
        //determines which function to call
        if (dataArr[0] === "spotify-this-song") {
            inputName = dataArr[1];
            searchSong();
        }
    });
}

//conditionals to call respective functions
if(command === "my-tweets") {
    searchTweets();

} else if(command === "spotify-this-song") {
    searchName();
    searchSong();
   
} else if(command === "movie-this") {
    searchName();
    searchMovie();
   
} else if(command === "do-what-it-says"){
    searchTxt();
    
} else {
    //if invalid command is entered
    console.log("I'm sorry, your clearence level states you only have access to the 'my-tweets', 'spotify-this-song', 'movie-this' and 'do-what-it-says' commands.");
}