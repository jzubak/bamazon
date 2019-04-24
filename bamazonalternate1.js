var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Monday15!",
    //this will need to be commented out to create a new DB using the "createdDB" function
    database: "top_songsDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);

    inquirer.prompt([
        {
            type: "list",
            name: "top5000search",
            message: "What would you like to search for?",
            choices: ["Artist Name", "Duplicate Artists", "Range", "Song Title"]


        }]).then(function (choices) {
            if (choices.top5000search === "Artist Name") {
                artist()
            }
            if (choices.top5000search === "Duplicate Artists") {
                duplicates()
            }
            if (choices.top5000search === "Range") {
                range()
            }
            if (choices.top5000search === "Song Title") {
                specificSong()
            }
        })

    // A query which returns all data for songs sung by a specific artist
    function artist() {
        inquirer.prompt([
            {
                type: "input",
                name: "artist_name",
                message: "which artist do you want to search for?"
            }]).then(function(artistquery) {
                connection.query("select * from songs where artist = ?", artistquery.artist_name, function (err, res) {
                    if (err) throw err;
                    for (var i = 0; i < res.length; i++) {
                        console.log(res[i].position + " | " + res[i].artist + " | " + res[i].title + " | " + res[i].year + " | " + res[i].popularity_world + " | " + res[i].popularity_USA + " | " + res[i].popularity_UK + " | " + res[i].popularity_Europe + " | " + res[i].popularity_rest);
                    }
                    connection.end();
                })
            })
        }
    //A query which returns all artists who appear within the top 5000 more than once
    function duplicates() {
        connection.query("select position, artist, count(*) from songs group by artist having count(*)>1", function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                console.log(res[i].position + " | " + res[i].artist + " | " + res[i].count);
            }
            connection.end();
        })
    }

    //A query which returns all data contained within a specific range
    function range() {
        inquirer.prompt([
            {
                type: "input",
                name: "range1",
                message: "what is the start of the range do you want to see songs in?"
            },
            {
                type: "input",
                name: "range2",
                message: "what is the end of the range do you want to see songs in?"
            }])
            .then(function(rangeSearch) {
        connection.query("select distinct * from songs where position between ? and ?;", [rangeSearch.range1, rangeSearch.range2], function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                console.log(res[i].position + " | " + res[i].artist + " | " + res[i].title + " | " + res[i].year + " | " + res[i].popularity_world + " | " + res[i].popularity_USA + " | " + res[i].popularity_UK + " | " + res[i].popularity_Europe + " | " + res[i].popularity_rest);
            }
            connection.end();
        })
    })
    }

    //A query which searches for a specific song in the top 5000 and returns the data for it
    function specificSong() {
        inquirer.prompt([
            {
                type: "input",
                name: "song_name",
                message: "which song do you want to search for?"
            }]).then(function(songquery) {
        connection.query("select distinct * from songs where title =?", songquery.song_name, function (err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                console.log(res[i].position + " | " + res[i].artist + " | " + res[i].title + " | " + res[i].year + " | " + res[i].popularity_world + " | " + res[i].popularity_USA + " | " + res[i].popularity_UK + " | " + res[i].popularity_Europe + " | " + res[i].popularity_rest);
            }
            connection.end();
        })
    })
    }
});

