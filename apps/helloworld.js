var alexa = require('../../alexa-app/index.js');
//var alexa = require('alexa-app');
var app = new alexa.app('helloworld');
app.onLaunch(function(req,res) {
	res.say("Hello World!");
});
