var hotswap = require('hotswap');
var fs = require('fs');
var path = path = require('path');
var express = require('express');
var alexa = require('alexa-app');
var bodyParser = require('body-parser');

// Start up the server
var expressApp = express();
var PORT = process.env.port || 80;
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(bodyParser.json());
expressApp.set('view engine', 'ejs');


// Monitor hotswap module reloading
hotswap.on('swap', function(filename) {
	console.log("hotswap reloaded "+filename);
});
hotswap.on('error', function(e) {
	console.log("-----\nhotswap error: "+e+"\n-----\n");
	//return false;
});

// Read in each application
var register_apps = function(app_dir,root) {
	var apps = {};
	var app_directories = function(srcpath) {
	  return fs.readdirSync(srcpath).filter(function(file) {
		return fs.statSync(path.join(srcpath, file)).isDirectory();
	  });
	}
	app_directories(app_dir).forEach(function(dir) {
		var package_json = app_dir + dir + "/package.json";
		if (!fs.existsSync(package_json) || !fs.statSync(package_json).isFile()) { 
			return; 
		}
		var pkg = require(package_json);
		if (!pkg || !pkg.main || !pkg.name) { 
			console.log("Failed to load "+package_json);
			return; 
		}
		var main = app_dir + dir + "/" + pkg.main;
		if (!fs.existsSync(main) || !fs.statSync(main).isFile()) { 
			console.log("main file not found for app ["+pkg.name+"]: "+main);
			return; 
		}
		try {
			var app = require(main);
			apps[pkg.name] = pkg;
			apps[pkg.name].exports = app;
			if (typeof app.express!="function") {
				console.log("App ["+pkg.name+"] is not an instance of alexa-app");
				return;
			}
			console.log("Loaded app: "+pkg.name);
			
			// Extract Alexa-specific attributes from package.json, if they exist
			if (typeof pkg.alexa=="object") {
				app.id = pkg.alexa.applicationId;
			}

			// The express() function in alexa-app doesn't play nicely with hotswap,
			// so bootstrap manually to express
			var endpoint = (root||'/') + (app.endpoint || app.name);
			expressApp.post(endpoint,function(req,res) {
				app.request(req.body).then(function(response) {
					res.json(response);
				},function(response) {
					res.status(500).send("Server Error");
				});
			});
			// Configure GET requests to run a debugger UI
			expressApp.get(endpoint,function(req,res) {
				res.render('test',{"app":app,"schema":app.schema(),"utterances":app.utterances(),"intents":app.intents});
			});
		}
		catch(e) {
			console.log("Error loading app ["+main+"]: "+e);
		}
	});
	return apps;
}

// Register Alexa apps
register_apps('./apps/','/');

// Serve static files
expressApp.use(express.static('public_html'));

expressApp.listen(PORT);
console.log("Listening on port "+PORT);
