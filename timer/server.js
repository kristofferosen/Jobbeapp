/**
 * Created by KristofferGard on 14.06.2016.
 */
// server.js

// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================

mongoose.connect('mongodb://localhost/jetbrains');     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());


var Jobb = mongoose.model('Jobb', {
    Jobbemann : String,
    Timer : Number,
    Dato : String,
    Kommentar : String
});

app.get('/api/jobbs', function(req, res) {

    // use mongoose to get all todos in the database
    Jobb.find(function(err, jobbs) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(jobbs); // return all todos in JSON format
    });
});

// create todo and send back all todos after creation
app.post('/api/jobbs', function(req, res) {

    // create a todo, information comes from AJAX request from Angular
    Jobb.create({
        Jobbemann : req.body.Jobbemann,
        Timer : req.body.Timer,
        Dato : req.body.Dato,
        Kommentar : req.body.Kommentar
    }, function(err, jobb) {
        if (err)
            res.send(err);

        console.log(jobb);

        // get and return all the todos after you create another
        Jobb.find(function(err, jobbs) {
            if (err)
                res.send(err)
            res.json(jobbs);
        });
    });

});

// delete a todo
app.delete('/api/jobbs/:jobb_id', function(req, res) {
    Jobb.remove({
        _id : req.params.jobb_id
    }, function(err, jobb) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Jobb.find(function(err, jobbs) {
            if (err)
                res.send(err)
            res.json(jobbs);
        });
    });
});

app.get('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});


// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");