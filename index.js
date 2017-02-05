var hotswap = require('hotswap');
var fs = require('fs');
var path = path = require('path');
var http = require('http');
var https = require('https');
var express = require('express');
var alexa = require('alexa-app');
var Promise = require('bluebird');
var defaults = require("lodash.defaults");

var appServer = function(config) {
  var self = {};
  config = config || {};

  var defaultOptions = {
    log: true,
    debug: true,
    verify: false,
    port: process.env.port || 8080,
    httpEnabled: true,
    httpsEnabled: false,
    server_root: ''
  };

  config = defaults(config, defaultOptions);

  if (config.verify && config.debug) {
    throw new Error("invalid configuration: the verify and debug options cannot be both enabled");
  }

  if (config.httpEnabled == false && config.httpsEnabled == false) {
    throw new Error("invalid configuration: either http or https must be enabled");
  }

  if (config.httpEnabled && config.httpsEnabled && config.port == config.httpsPort) {
    throw new Error("invalid configuration: http and https ports must be different");
  }

  self.apps = {};

  self.log = function(msg) {
    if (config.log) {
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

  var errorCallback = function(e) {
    self.error("-----\nhotswap error: " + e + "\n-----\n");
  };

  hotswap.on('swap', hotswapCallback);
  hotswap.on('error', errorCallback);

  // Load application modules
  self.load_apps = function(app_dir, root) {
    // set up a router to hang all alexa apps off of
    var alexaRouter = express.Router();

    var normalizedRoot = root.indexOf('/') === 0 ? root : '/' + root;
    self.express.use(normalizedRoot, alexaRouter);

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

      var app;
      try {
        app = require(main);
      } catch (e) {
        self.error("   error loading app [" + main + "]: " + e);
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
        checkCert: config.verify,
        preRequest: config.preRequest,
        postRequest: config.postRequest
      });

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
    // Instantiate up the server
    // TODO: add i18n support (i18n-node might be a good look)
    // Issue #12: https://github.com/alexa-js/alexa-app-server/issues/12
    self.express = express();

    self.express.set('views', path.join(__dirname, 'views'));
    self.express.set('view engine', 'ejs');
    self.express.use(express.static(path.join(__dirname, 'views')));

    // Run the pre() method if defined
    if (typeof config.pre == "function") {
      config.pre(self);
    }

    // Serve static content
    var static_dir = path.join(config.server_root, config.public_html || 'public_html');
    if (fs.existsSync(static_dir) && fs.statSync(static_dir).isDirectory()) {
      self.log("serving static content from: " + static_dir);
      self.express.use(express.static(static_dir));
    } else {
      self.log("not serving static content because directory [" + static_dir + "] does not exist");
    }

    // Find any server-side processing modules and let them hook in
    var server_dir = path.join(config.server_root, config.server_dir || 'server');
    if (fs.existsSync(server_dir) && fs.statSync(server_dir).isDirectory()) {
      self.log("loading server-side modules from: " + server_dir);
      self.load_server_modules(server_dir);
    } else {
      self.log("no server modules loaded because directory [" + server_dir + "] does not exist");
    }

    // Find and load alexa-app modules
    var app_dir = path.join(config.server_root, config.app_dir || 'apps');
    if (fs.existsSync(app_dir) && fs.statSync(app_dir).isDirectory()) {
      self.log("loading apps from: " + app_dir);
      self.load_apps(app_dir, config.app_root || '/alexa');
    } else {
      self.log("apps not loaded because directory [" + app_dir + "] does not exist");
    }

    if (config.httpsEnabled == true) {
      self.log("enabling https");

      if (config.privateKey != undefined && config.certificate != undefined && config.httpsPort != undefined) { // Ensure that all of the needed properties are set
        var privateKeyFile = config.server_root + '/sslcert/' + config.privateKey;
        var certificateFile = config.server_root + '/sslcert/' + config.certificate;
        var chainFile = (config.chain != undefined) ? config.server_root + '/sslcert/' + config.chain : undefined; //optional chain bundle

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
                self.httpsInstance = httpsServer.listen(config.httpsPort, config.host);
                self.log("listening on https://" + config.host + ":" + config.httpsPort);
              } else {
                self.httpsInstance = httpsServer.listen(config.httpsPort);
                self.log("listening on https port " + config.httpsPort);
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
        self.error("httpsPort, privateKey or certificate parameter is not set in config, https will not be enabled");
      }
    }

    if (config.httpEnabled) {
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

    return this;
  };

  self.stop = function() {
    // close all server instances
    if (typeof self.instance !== "undefined") {
      self.instance.close();
    }

    if (typeof self.httpsInstance !== "undefined") {
      self.httpsInstance.close();
    }

    // deactivate all hotswap listener
    hotswap.removeListener('swap', hotswapCallback);
    hotswap.removeListener('error', errorCallback);
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
