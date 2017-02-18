var alexa = require('alexa-app');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

// Define an alexa-app
var app = new alexa.app('bad_app_name_mismatch');
app.launch(function(req,res) {
	res.say("This app should message the app name endpoint, not the package.json name");
});
module.exports = app;
