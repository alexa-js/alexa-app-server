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

    if (config.verify === true && config.debug === true) {
        throw new Error("invalid configuration: the verify and debug options cannot be both enabled");
    }

    self.apps = {};

    self.log = function(msg) {
        if (config.log !== false) {
            console.log(msg);
        }
    };
    self.error = function(msg) {
        console.error(msg);
    };

    // Configure hotswap to watch for changes and swap out module code
    var hotswapCallback = function(filename) {
        self.log("hotswap reloaded " + filename);
    };

    var hotswapErrorCallback = function(e) {
        self.error("-----\nhotswap error: " + e + "\n-----\n");
    };

    hotswap.on('swap', hotswapCallback);
    hotswap.on('error', hotswapErrorCallback);

    // Load application modules
    self.load_apps = function(app_dir, root) {
        // set up a router to hang all alexa apps off of
        var alexaRouter = express.Router()

        var normalizedRoot = root.indexOf('/') === 0 ? root : '/' + root

        self.express.use(normalizedRoot, alexaRouter)

        var app_directories = function(srcpath) {
            return fs.readdirSync(srcpath).filter(function(file) {
                return fs.statSync(path.join(srcpath, file)).isDirectory();
            });
        };
        app_directories(app_dir).forEach(function(dir) {
            var package_json = path.join(app_dir, dir, "/package.json");
            if (!fs.existsSync(package_json) || !fs.statSync(package_json).isFile()) {
                self.error("   package.json not found in directory " + dir);
                return;
            }
            var pkg = JSON.parse(fs.readFileSync(package_json, 'utf8'));
            if (!pkg || !pkg.main || !pkg.name) {
                self.error("   failed to load " + package_json);
                return;
            }
            var main = fs.realpathSync(path.join(app_dir, dir, pkg.main));
            if (!fs.existsSync(main) || !fs.statSync(main).isFile()) {
                self.error("   main file not found for app [" + pkg.name + "]: " + main);
                return;
            }

            // TODO: better to just let the server crash. protecting broken code
            //       enables sloppy behavior and practices.

            // wrapped in a try catch block to avoid crashing the whole app-server
            var app;
            try {
                app = require(main);
            } catch (e) {
                self.error("error loading app [" + main + "]: " + e);
                return;
            }

            self.apps[pkg.name] = pkg;
            self.apps[pkg.name].exports = app;
            if (typeof app.express != "function") {
                self.error("   app [" + pkg.name + "] is not an instance of alexa-app");
                return;
            }

            // Extract Alexa-specific attributes from package.json, if they exist
            if (typeof pkg.alexa == "object") {
                app.id = pkg.alexa.applicationId;
            }

            // attach the alexa-app instance to the alexa router
            app.express({
                expressApp: alexaRouter,
                router: express.Router(),
                debug: config.debug,
                checkCert: config.verify
            })

            self.log("   loaded app [" + pkg.name + "] at endpoint: " + normalizedRoot + "/" + pkg.name);
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
            file = fs.realpathSync(path.join(server_dir, file));
            self.log("   loaded " + file);
            var func = require(file);
            if (typeof func == "function") {
                func(self.express, self);
            }
        });
    };

    self.start = function() {
        self.express = express();

        // each app is attached to express before any middlewares or routes
        // this ensures the alexa routers will have middlewares totally separate
        // from everything else
        var app_dir = path.join(server_root, config.app_dir || 'apps');
        if (fs.existsSync(app_dir) && fs.statSync(app_dir).isDirectory()) {
            self.log("loading apps from: " + app_dir);
            self.load_apps(app_dir, config.app_root || '/alexa');
        } else {
            self.log("apps not loaded because directory [" + app_dir + "] does not exist");
        }

        // TODO: change this to make sure it doesn't affect other non-Alexa services/apps
        // Issue #35: https://github.com/alexa-js/alexa-app-server/issues/35
        self.express.use(bodyParser.urlencoded({ extended: true }));

        // We need the rawBody for request verification
        // TODO: change code to possibly use bodyParser.json()
        // Issue #21: https://github.com/alexa-js/alexa-app-server/issues/21
        self.express.use(function(req, res, next) {
            // mark the request body as already having been parsed so it's ignored by
            // other body parser middlewares
            req._body = true;
            req.rawBody = '';
            req.on('data', function(data) {
                return req.rawBody += data;
            });
            req.on('end', function() {
                try {
                    req.body = JSON.parse(req.rawBody);
                } catch (error) {
                    req.body = {};
                }
                next();
            });
        });
        self.express.set('views', path.join(__dirname, 'views'));
        self.express.set('view engine', 'ejs');
        self.express.use(express.static(path.join(__dirname, 'views')));

        // Run the pre() method if defined
        if (typeof config.pre == "function") {
            config.pre(self);
        }

        // Serve static content
        var static_dir = path.join(server_root, config.public_html || 'public_html');
        if (fs.existsSync(static_dir) && fs.statSync(static_dir).isDirectory()) {
            self.log("serving static content from: " + static_dir);
            self.express.use(express.static(static_dir));
        } else {
            self.log("not serving static content because directory [" + static_dir + "] does not exist");
        }

        // Find any server-side processing modules and let them hook in
        var server_dir = path.join(server_root, config.server_dir || 'server');
        if (fs.existsSync(server_dir) && fs.statSync(server_dir).isDirectory()) {
            self.log("loading server-side modules from: " + server_dir);
            self.load_server_modules(server_dir);
        } else {
            self.log("no server modules loaded because directory [" + server_dir + "] does not exist");
        }

        config.port = config.port || process.env.port || 8080;

        if (config.https == true) {
            self.log("enabling https");

            if (config.privateKey != undefined && config.certificate != undefined) { // Ensure that all of the needed properties are set
                var privateKeyFile = server_root + '/sslcert/' + config.privateKey;
                var certificateFile = server_root + '/sslcert/' + config.certificate;
                var chainFile = (config.chain != undefined) ? server_root + '/sslcert/' + config.chain : undefined; //optional chain bundle

                if (fs.existsSync(privateKeyFile) && fs.existsSync(certificateFile)) { // Make sure the key and cert exist.
                    var privateKey = fs.readFileSync(privateKeyFile, 'utf8');
                    var certificate = fs.readFileSync(certificateFile, 'utf8');

                    var chain = undefined;
                    if (chainFile != undefined) {
                        if (fs.existsSync(chainFile)) {
                            chain = fs.readFileSync(chainFile, 'utf8');
                        } else {
                            self.error("chain: '" + config.chain + "' does not exist in /sslcert");
                        }
                    }

                    if (chain == undefined && chainFile != undefined) {
                        self.error("failed to load chain from /sslcert, https will not be enabled");
                    } else if (privateKey != undefined && certificate != undefined) {
                        var credentials = {
                            key: privateKey,
                            cert: certificate
                        };

                        if (config.passphrase != undefined) {
                            credentials.passphrase = config.passphrase
                        }

                        if (chain != undefined) { //if chain is used the add to credentials
                            credentials.ca = chain;
                            self.log("using chain certificate from /sslcert");
                        }

                        try { // These two lines below can fail it the certs were generated incorrectly. But we can continue startup without HTTPS
                            var httpsServer = https.createServer(credentials, self.express); // create the HTTPS server

                            // TODO: add separate option to specify specific host address for HTTPS server to bind to???
                            // Issue #38: https://github.com/alexa-js/alexa-app-server/issues/38
                            if (typeof config.host === 'string') {
                                self.instance = httpsServer.listen(config.port, config.host);
                                self.log("listening on https://" + config.host + ":" + config.port);
                            } else {
                                self.instance = httpsServer.listen(config.port);
                                self.log("listening on https port " + config.port);
                            }
                        } catch (error) {
                            self.error("failed to listen via https: " + error);
                        }
                    } else {
                        self.error("failed to load privateKey or certificate from /sslcert, https will not be enabled");
                    }
                } else {
                    self.error("privateKey: '" + config.privateKey + "' or certificate: '" + config.certificate + "' do not exist in /sslcert, https will not be enabled");
                }
            } else {
                self.error("privatekey or certificate parameter is not set in config, https will not be enabled");
            }
        } else {
            if (typeof config.host === 'string') {
                self.instance = self.express.listen(config.port, config.host);
                self.log("listening on http://" + config.host + ":" + config.port);
            } else {
                self.instance = self.express.listen(config.port);
                self.log("listening on http port " + config.port);
            }
        }

        // Run the post() method if defined
        if (typeof config.post == "function") {
            config.post(self);
        }

        return this.instance;
    };

    self.stop = function() {
        // close all server instances
        if (typeof self.instance !== "undefined") {
            self.instance.close();
        }

        // deactivate all hotswap listener
        hotswap.removeListener('swap', hotswapCallback);
        hotswap.removeListener('error', hotswapErrorCallback);
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
