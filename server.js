var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

// var PORT = 3000;

var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static('public'));

var databaseUri= 'mongodb://localhost/week18day3mongoose';
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    mongoose.connect(databaseUri);
}

var db = mongoose.connection;

db.on('error', function(err) {
    console.log('Mongoose Error: ', err);
});
db.once('open', function() {
    console.log('Mongoose connection successful.');
});

app.get("/scrape", function(req, res){
    axios.get("http://www.spiegel.de/international/").then(function(response){
        var $ = cheerio.load(response.data);
        $('div.teaser').each(function(i,element) {
            var result = {};

            result.section = $(this)
            .children()
            .find("span.headline-intro")
            .text()
            .trim();
        })
    })
    console.log(response)
});



