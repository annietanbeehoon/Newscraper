var express = require("express"); //
var bodyParser = require("body-parser"); // 
var logger = require("morgan"); // 
var mongoose = require("mongoose"); //
var request = require("request");

var axios = require("axios"); //
var cheerio = require("cheerio"); //

var db = require("./models"); // 

var PORT = process.env.PORT || 3000; //

var app = express();//

app.use(logger('dev'));//
app.use(bodyParser.urlencoded({ extended: true }));//
app.use(express.static('public'));//

//mongoose.connect("mongodb://localhost/aNewscraper");

var databaseUri = 'mongodb://localhost/aNewscraper';//
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    mongoose.connect(databaseUri);
}

var db = mongoose.connection;

db.on('error', function (err) {
    console.log('Mongoose Error: ', err);
});
db.once('open', function () {
    console.log('Mongoose connection successful.');
});

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise; //
mongoose.connect(MONGODB_URI); {
    useMongoClient: true
} //

app.get("/scrape", function (req, res) {
        axios.get("http://www.businessinsider.com/thelife").then(function (response) {
        var $ = cheerio.load(response.data);
        $("h3").each(function (i, element) {
            var result = {};

            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");
            result.img = $(this)
                .parent()
                .find("a")
                .find(".river-image")
                .children("img")
                .attr("src")
            

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    res.json(err);
                });
        });

        return res.redirect("/");
    });
    console.log(res)
});

app.get("/articles", function (req, res) {

    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        })
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({
        _id: req.params.id
    })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});


app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote.id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });

app.post("article/:id", function(req, res){
    db.Note.findOneAndRemove({ _id: req.params.id }, {note: dbNote._id})
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
    })
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

});
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});


// attempt at scraping inside science //

          // axios.get("https://www.insidescience.org/").then(function(response){
        //     var $ = cheerio.load(response.data);
        //     $("h2").each(function(i,element){
        //         var result = {};

        //         result.title= $(this)
        //         .children("a")
        //         .text();
        //         result.link= $(this)
        //         .children("a")
        //         .attr("href");
        //         result.summary= $(this)
        //         .children("p")
        //         .text();

// attempt at scraping business insider // 
        // axios.get("http://www.businessinsider.com/thelife").then(function (response) {
        // var $ = cheerio.load(response.data);
        // $("h3").each(function (i, element) {
        //     var result = {};

        //     result.title = $(this)
        //         .children("a")
        //         .text();
        //     result.link = $(this)
        //         .children("a")
        //         .attr("href");

    // attempt at scraping dogonews // 

        // axios.get("https://www.dogonews.com/").then(function (response) {
        // var $ = cheerio.load(response.data);
        // $('div , .row').each(function (i, element) {
        //     var result = {};

        //     result.title = $(this)
        //         .children("h3 a")
        //         .text();


        // axios.get("https://www.dogonews.com/").then(function (response) {
        // var $ = cheerio.load(response.data);
        // $("div.row").each(function (i, element) {
        //     var result = {};

        //     //result.section = $(this).children().find("a").find("span").text();
        //     result.article = $(this).children().find("p").text();
        //     result.title = $(this).children().find("h3").find("a").text();
        //     result.link = $(this).children().find("div").find("h3").find("a").attr("href");
        //     result.photolink = $(this).children().find("a").find("img").attr("src");