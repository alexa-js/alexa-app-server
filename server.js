// Start up the server
var express = require('express');
var alexa = require('../alexa-app/index.js');
//var alexa = require('alexa-app');
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.port || 8080;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

// Pull in all the Alexa apps
require('require-dir')('./apps');

// Attach all the Alex apps to express
alexa.bootstrap(app,'/');

app.listen(PORT);
console.log("Listening on port "+PORT);
