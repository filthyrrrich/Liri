# Liri
Conclusion:
Like SIRI but less annoying.
This assignment was our first attempt at building an app with node.js. Node felt pretty foreign at first, but after this assignment, I am feeling much more comfortable. This app takes in 4 different commands and calls a function based on user input. It utilizes the request, spotify, and twitter APIs along with fs.readfile. This assignment was slow for me to get started but once I got the ball rolling, things begin flowing fairly easily. I spent about 6hrs on this app.


Psuedo Code:

Add requires (request/spotify/twitter/fs).
Function for Tweets.
    Uses twitter API.
    For loop to display last 20 tweets in console.

Function for Spotify.
    Uses spotify API.
    Displays search criteria in console.

Function for Movie
    Uses request for OMDB.
    Displays search criteria in console.

Function for readFile.
    Uses fs.readfile on random.txt
    Puts string of txt into array split by commas.
    Runs function based on text and search info.

Call functions with conditional statements when user enters in specific commands.
