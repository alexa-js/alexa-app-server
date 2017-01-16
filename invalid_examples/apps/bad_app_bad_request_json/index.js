var alexa = require('alexa-app');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// Define an alexa-app
var app = new alexa.app('bad_app_bad_request');
app.launch(function(req,res) {
	res.say("This app should not load!");
});
module.exports = app;
