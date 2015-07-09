var alexa = require('alexa-app');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// Define an alexa-app
var app = new alexa.app('helloworld');
app.launch(function(req,res) {
	res.say("Hello World!!");
});
app.intent('NameIntent', {
		"slots":{"NAME":"LITERAL","AGE":"NUMBER"}
		,"utterances":["{My name is|my name's} {matt|bob|bill|jake|nancy|mary|jane|NAME} and I am {1-100|AGE}{ years old|}"]
	},function(req,res) {
		res.say('Your name is '+req.slot('NAME')+' and you are '+req.slot('AGE')+' years old');
	}
);
app.intent('AgeIntent', {
		"slots":{"AGE":"NUMBER"}
		,"utterances":["My age is {1-100|AGE}"]
	},function(req,res) {
		res.say('Your age is '+req.slot('AGE'));
	}
);
module.exports = app;
