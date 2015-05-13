var alexa = require('../../alexa-app/index.js');
//var alexa = require('alexa-app');
var app = new alexa.app('guessinggame','guessinggame');
app.onLaunch(function(req,res) {
	var number = Math.floor(Math.random()*99)+1;
	res.session('number',number);
	res.session('guesses',0);
	res.say("Guess a number between 1 and 100!");
	res.shouldEndSession(false);
});
app.intent('guess',function(req,res) {
	console.log('x');
	var guesses = (+req.session('guesses'))+1;
	console.log(guesses);
	var guess = req.slot('guess');
	console.log(guess);
	var number = +req.session('number');
	console.log(number);
	if (!guess) {
		res.say("Sorry, I didn't hear a guess");
		res.shouldEndSession(true);
	}
	else if (guess===number) {
		res.say("Congratulations, you guessed the number in " + guesses + (guesses==1?" try":" tries"));
		res.shouldEndSession(true);
	}
	else {
		if (guess > number) {
			res.say("Guess lower.");
		}
		else if (guess < number) {
			res.say("Guess higher.");
		}
		res.session('guesses',guesses);
		res.shouldEndSession(false);
	}
});
