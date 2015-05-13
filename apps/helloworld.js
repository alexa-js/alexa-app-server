var alexa = require('alexa-app');
var app = new alexa.app('helloworld');
app.launch(function(req,res) {
	res.say("Hello World!");
});
