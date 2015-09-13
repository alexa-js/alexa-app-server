var hotswap = require('hotswap');
var fs = require('fs');
var path = path = require('path');
var http = require('http');
var https = require('https');
var express = require('express');
var alexa = require('alexa-app');
var bodyParser = require('body-parser');
var Promise = require('bluebird');

var appServer = function(config) {
	var self = {};
	config = config || {};
	var server_root = config.server_root || '';
	self.apps = {};
	
	self.log = function(msg) {
		if (config.log!==false) {
			console.log(msg);
		}
	};
	self.error = function(msg) { console.log(msg); };
	
	// Configure hotswap to watch for changes and swap out module code
	hotswap.on('swap', function(filename) {
		self.log("hotswap reloaded "+filename);
	});
	hotswap.on('error', function(e) {
		self.log("-----\nhotswap error: "+e+"\n-----\n");
	});

	// Load application modules
	self.load_apps = function(app_dir,root) {
		var app_directories = function(srcpath) {
		  return fs.readdirSync(srcpath).filter(function(file) {
			return fs.statSync(path.join(srcpath, file)).isDirectory();
		  });
		}
		app_directories(app_dir).forEach(function(dir) {
			var package_json = path.join(app_dir,dir,"/package.json");
			if (!fs.existsSync(package_json) || !fs.statSync(package_json).isFile()) { 
				self.log("   package.json not found in directory "+dir);
				return; 
			}
			var pkg = JSON.parse(fs.readFileSync(package_json, 'utf8'));
			if (!pkg || !pkg.main || !pkg.name) { 
				self.log("   Failed to load "+package_json);
				return; 
			}
			var main = fs.realpathSync( path.join(app_dir,dir,pkg.main) );
			if (!fs.existsSync(main) || !fs.statSync(main).isFile()) { 
				self.log("   main file not found for app ["+pkg.name+"]: "+main);
				return; 
			}
			try {
				var app = require(main);
				self.apps[pkg.name] = pkg;
				self.apps[pkg.name].exports = app;
				if (typeof app.express!="function") {
					self.log("   App ["+pkg.name+"] is not an instance of alexa-app");
					return;
				}
				
				// Extract Alexa-specific attributes from package.json, if they exist
				if (typeof pkg.alexa=="object") {
					app.id = pkg.alexa.applicationId;
				}

				// The express() function in alexa-app doesn't play nicely with hotswap,
				// so bootstrap manually to express
				var endpoint = (root||'/') + (app.endpoint || app.name);
				self.express.post(endpoint,function(req,res) {
					var json = req.body, response_json;
					// preRequest may return altered request JSON, or undefined, or a Promise
					Promise.resolve( typeof config.preRequest=="function" ? config.preRequest(json,req,res) : json )
						.then(function(json_new) {
							if (json_new) {
								json = json_new;
							}
							return json;
						})
						.then(app.request)
						.then(function(app_response_json) {
							response_json = app_response_json;
							return Promise.resolve( typeof config.postRequest=="function" ? config.postRequest(app_response_json,req,res) : app_response_json )
						})
						.then(function(response_json_new) {
							response_json = response_json_new || response_json;
							res.json(response_json).send();
						})
						.catch(function() {
							res.status(500).send("Server Error");
						});
				});
				// Configure GET requests to run a debugger UI
				if (false!==config.debug) {
					self.express.get(endpoint,function(req,res) {
						if (typeof req.param('schema')!="undefined") {
							res.set('Content-Type', 'text/plain').send(app.schema());
						}
						else if (typeof req.param('utterances')!="undefined") {
							res.set('Content-Type', 'text/plain').send(app.utterances());
						}
						else {
							res.render('test',{"app":app,"schema":app.schema(),"utterances":app.utterances(),"intents":app.intents});
						}
					});
				}
				
				self.log("   Loaded app ["+pkg.name+"] at endpoint: "+endpoint);
			}
			catch(e) {
				self.log("Error loading app ["+main+"]: "+e);
			}
		});
		return self.apps;
	};

	// Load server modules. For example, code the process forms, etc. Anything that
	// wants to hook into express
	self.load_server_modules = function(server_dir) {
		var server_files = function(srcpath) {
			return fs.readdirSync(srcpath).filter(function(file) {
				return fs.statSync(path.join(srcpath, file)).isFile();
			});
		};
		server_files(server_dir).forEach(function(file) {
			file = fs.realpathSync( path.join(server_dir,file) );
			self.log("   Loaded "+file);
			var func = require(file);
			if (typeof func=="function") {
				func(self.express, self);
			}
		});
	};
	
	self.start = function() {
		// Instantiate up the server
		self.express = express();
		self.express.use(bodyParser.urlencoded({ extended: true }));
		self.express.use(bodyParser.json());
		self.express.set('views', path.join(__dirname,'views'));
		self.express.set('view engine', 'ejs');

		// Run the pre() method if defined
		if (typeof config.pre=="function") {
			config.pre(self);
		}
		
		// Serve static content
		var static_dir = path.join(server_root,config.public_html || 'public_html');
		if (fs.existsSync(static_dir) && fs.statSync(static_dir).isDirectory()) { 
			self.log("Serving static content from: "+static_dir);
			self.express.use(express.static(static_dir));
		}
		else {
			self.log("Not serving static content because directory ["+static_dir+"] does not exist");
		}
		
		// Find any server-side processing modules and let them hook in
		var server_dir = path.join(server_root,config.server_dir || 'server');
		if (fs.existsSync(server_dir) && fs.statSync(server_dir).isDirectory()) { 
			self.log("Loading server-side modules from: "+server_dir);
			self.load_server_modules(server_dir);
		}
		else {
			self.log("No server modules loaded because directory ["+server_dir+"] does not exist");
		}

		// Find and load alexa-app modules
		var app_dir = path.join(server_root,config.app_dir || 'apps');
		if (fs.existsSync(app_dir) && fs.statSync(app_dir).isDirectory()) { 
			self.log("Loading apps from: "+app_dir);
			self.load_apps(app_dir,config.app_root || '/alexa/');
		}
		else {
			self.log("Apps not loaded because directory ["+app_dir+"] does not exist");
		}
		
		if(config.httpsEnabled == true) {
			self.log("httpsEnabled is true. Reading HTTPS config");

			if(config.privateKey != undefined && config.certificate != undefined && config.httpsPort != undefined) { //Ensure that all of the needed properties are set
				var privateKeyFile = 'sslcert/' + config.privateKey;
				var certificateFile = 'sslcert/' + config.certificate;
				
				if(fs.existsSync(privateKeyFile) && fs.existsSync(certificateFile)) { //Make sure the key and cert exist.
					
					var privateKey  = fs.readFileSync(privateKeyFile, 'utf8');
					var certificate = fs.readFileSync(certificateFile  , 'utf8');
			
						if(privateKey != undefined && certificate != undefined) {
							var credentials = {key: privateKey, cert: certificate};
								
									try { //The line below can fail it the certs were generated incorrectly. But we can continue startup without HTTPS
								  	https.createServer(credentials, self.express).listen(config.httpsPort); //create the HTTPS server 
								  	self.log("Listening on HTTPS port " + config.httpsPort);
								}catch(error) {
									self.log("Failed to listen via HTTPS Error: " + error);
								}
						} else {
						self.log("Failed to load privateKey or certificate from /sslcert. HTTPS will not be enabled");
				
						} 
			
				} else {
				self.log("privateKey: '" + config.privateKey +  "' or certificate: '" + config.certificate + "' do not exist in /sslcert. HTTPS will not be enabled");
		
				} 	
		} else {
			self.log("privatekey, httpsPort, or certificate paramater not set in config. HTTPS will not be enabled");
				
		}
		
	}
		// Start the server listening
		config.port = config.port || process.env.port || 80;
		self.express.listen(config.port);
		self.log("Listening on HTTP port "+config.port);
		
		// Run the post() method if defined
		if (typeof config.post=="function") {
			config.post(self);
		}
	};
	
	return self;
};

// A shortcut start(config) method to avoid creating an instance if not needed
appServer.start = function(config) {
	var appServerInstance = new appServer(config);
	appServerInstance.start();
	return appServerInstance;
};

module.exports = appServer;
