# alexa-app-server

An Alexa App (Skill) Server module using Node.js and the [alexa-app](https://www.npmjs.com/package/alexa-app) module.

[![NPM](https://img.shields.io/npm/v/alexa-app-server.svg)](https://www.npmjs.com/package/alexa-app-server/)
[![Build Status](https://travis-ci.org/alexa-js/alexa-app-server.svg?branch=master)](https://travis-ci.org/alexa-js/alexa-app-server)
[![Coverage Status](https://coveralls.io/repos/github/alexa-js/alexa-app-server/badge.svg?branch=master)](https://coveralls.io/github/alexa-js/alexa-app-server?branch=master)

## Stable Release

You're reading the documentation for the stable release of alexa-app-server, 3.0.2. Please see [CHANGELOG](CHANGELOG.md) and make sure to read [UPGRADING](UPGRADING.md) when upgrading from a previous version.

## Installation

```
npm install alexa-app-server --save
```

## Usage

```javascript
var AlexaAppServer = require('alexa-app-server');

var instance = AlexaAppServer.start({
  server_root: __dirname,     // Path to root
  public_html: "public_html", // Static content
  app_dir: "apps",            // Location of alexa-app modules
  app_root: "/alexa/",        // Service root
  port: 8080                  // Port to use
});

instance.stop();              // Stop the server
```

## Summary

The alexa-app-server module offers a stand-alone web server to host Alexa Apps (Skills). Think of it as a simple "container" that allows you to easily publish multiple Alexa Apps with one server. This module does not help you write the Alexa Apps (Skills) themselves, as apps are independent modules, written using the [alexa-app](https://www.npmjs.com/package/alexa-app) framework.

The server can also serve static website content, and offers a built-in Alexa App debugger/simulator. This allows you to test your skill using a web browser and view the responses, without actually using an Amazon Echo.

## Key Features

- Multiple apps can be hosted on a single server
  - Apps are stored in the /apps directory by default
  - Each app is a stand-alone Node module, built using the alexa-app framework
  - Each app must export its alexa-app instance to be loaded into the server
  - package.json contains information about the app, including (optionally) the appId
  - The hotswap module reloads code changes to apps, if they set `module.change_code = 1`
- Built-in Echo Simulator
  - Debug apps by issuing a GET request to the app endpoints
  - Send simulated requests to your app, view the JSON response
  - Session variables are automatically maintained between requests
  - Send intent requests and set slot values
  - View generated schema and utterances
- Supports HTTPs

## Starting The Server

You can either get a reference to an `AlexaAppServer` instance, or you can use the `start()` method shortcut. Getting a reference allows you to inspect or change the server object later.

```javascript
var AlexaAppServer = require('alexa-app-server');
var server = new AlexaAppServer({ port: 80, debug: false });
server.start();
server.express.use('/test', function(req, res) { res.send("OK"); });
```

```javascript
var AlexaAppServer = require('alexa-app-server');
AlexaAppServer.start({ port: 8080 });
```

## Configuration Options

The `start()` method accepts a configuration object. The defaults are shown below.

```javascript
require('alexa-app-server').start({

  // In order to start the server from a working directory other than
  // where your server.js file, you need to provide Node the full path
  // to your server's root directory.
  // Default is __dirname.
  server_root: __dirname,

  // A directory containing static content to serve as the document root.
  // This directory is relative to the script using alexa-app-server, not
  // relative to the module directory.
  // Default is 'public_html'.
  public_html: 'public_html',

  // A directory containing Alexa Apps. This directory should contain one
  // or more subdirectories. Each subdirectory is a stand-alone Alexa App
  // built with the alexa-app framework. These directories are each
  // processed during server startup and hooked into the server.
  // Default is 'apps'.
  app_dir: 'apps',

  // The prefix to use for all Alexa Apps. For example, you may want all
  // your Alexa endpoints to be accessed under the "/api/" path off the
  // root of your web server.
  // Default is 'alexa'.
  app_root: 'alexa',

  // The directory containing server-side processing modules.
  // Default is 'server'.
  server_dir: 'server',

  // Enable http support.
  // Default is true.
  httpEnabled: true,

  // The port the server should bind to.
  // Default is 8080.
  port: 8080,

  // The host address in which the server should bind to.
  // By default, the host is omitted and the server will accept connections on
  // any IPv6 address (::) when IPv6 is available, or any IPv4 address (0.0.0.0) otherwise.
  host: '127.0.0.1',

  // Show debugger UI with GET requests to Alexa App endpoints.
  // Note that the 'verify' and 'debug' options cannot be used together.
  // Default is true.
  debug: true,

  // Log useful information with console.log().
  // Default is true.
  log: true,

  // Insert alexa-verifier-middleware and add verification for Alexa requests
  // as required by the Alexa certification process.
  // Default is false.
  verify: false,

  // The pre() method is called after the express server has been instantiated, but
  // before any Alexa Apps have been loaded. It is passed the AlexaAppServer object itself.
  pre: function(appServer) { },

  // The post() method is called after the server has started and the start() method
  // is ready to exit. It's passed the AlexaAppServer object itself.
  post: function(appServer) { },

  // Like pre(), but this function is fired on every request, but before the
  // application itself gets called. You can use this to load up user details before
  // every request, for example, and insert it into the json request itself for
  // the application to use.
  // If it returns a falsy value, the request json is not changed.
  // If it returns a non-falsy value, the request json is replaced with what was returned.
  // If it returns a Promise, request processing pauses until the Promise resolves.
  // The value passed on by the promise (if any) replaces the request json.
  preRequest: function(json, request, response) { },

  // Like post(), but this function is fired after every request. It has a final
  // opportunity to modify the JSON response before it is returned back to the
  // Alexa service.
  // If it returns a falsy value, the response json is not changed.
  // If it returns a non-falsy value, the response json is replaced with what was returned.
  // If it returns a Promise, response processing pauses until the Promise resolves.
  // The value passed on by the promise (if any) replaces the response json.
  postRequest : function(json, request, response) { },

  // Enable https support. Note httpsPort, privateKey, and certificate are required.
  // Default is false.
  httpsEnabled: false,

  // The https port the server will bind to. Required for httpsEnabled support.
  // Default is undefined.
  httpsPort: 443,

  // The private key filename. This file must reside in the sslcert folder under the
  // root of the project.
  // Default is undefined.
  privateKey: 'private-key.pem',

  // The certificate filename. This file must reside in the sslcert folder under the root of the
  // project.
  // Default is undefined.
  certificate: 'cert.cer',

  // The certificate chain bundle filename. This is an optional file that must reside in the
  // sslcert folder under the root of the project.
  // Default is undefined.
  chain: 'cert.ca_bundle',

  // An optional passphrase used to validate certificate and key files. For best practice, don't
  // put the password directly in your source code, especially if it's going to be on GitHub, and
  // instead, load it from process.env or a file included in the .gitignore list.
  // Default is undefined.
  passphrase: 'passphrase'

});
```

## Enabling HTTPs

You can use a PaaS, such as Heroku, which comes with SSL enabled out-of-the-box.

Alternatively, you can enable HTTPs support using the instructions below.

Generate a x509 SSL Certificate using the following:

```bash
openssl genrsa -out private-key.pem 1024
openssl req -new -x509 -key private-key.pem -out cert.cer -days 365
```

To make sure the certificate is verified, use the following:

```bash
openssl x509 -noout -text -in cert.cer
```

Place the two generated files in the sslcert directory.

Add the following properties the to config that creates the server.

```javascript
AlexaAppServer.start({
  httpsPort: 443,
  httpsEnabled: true,
  privateKey: 'private-key.pem',
  certificate: 'cert.cer'
});
```

## Debugging With The Echo Simulator

Each app (skill) is available at a url endpoint on the server, and responds to POST requests from the Echo. If you load an app's endpoint in your browser with a GET request, it will display an echo simulator that can be used to debug your application. With it, you can send different request types to your app, load slots with values you specify, etc and see the actual generated JSON output from your application.

### Show Application ID

To show the application ID in the session correctly, set `applicationId` in `package.json`.

```javascript
{
  "alexa": {
    "applicationId": "amzn1.echo-sdk-ams.app.999999-d0ed-9999-ad00-999999d00ebe"
  }
}
```

Assign the value in your alexa-app.

```javascript
var app = new alexa.app('hello_world');
app.id = require('./package.json').alexa.applicationId;
```

## View Generated Schema And Utterances

In the Echo Simulator, your application's schema definition and example utterances are displayed. These can be directly pasted into the Amazon Developer interface when defining your skill.

You can also get the schema and utterances directly from your endpoint url using url parameters:
```
GET /your/app/endpoint?schema
GET /your/app/endpoint?utterances
```

## Dynamic Server-Side Functionality

Most servers will need some server-side processing logic, such as handling logins, or processing forms. You can specify a directory containing files that define server-side functionality by hooking into Express. These files are stand-alone modules that export a single function that the framework calls. An example is below and in the "examples/server" directory.

The default directory used to hold these modules is "server" but you can change this by using the "server_dir" configuration parameter, as shown above.

For example, [examples/server/login.js](examples/server/login.js):

```javascript
module.exports = function(express, alexaAppServerObject) {
  express.use('/login', function(req, res) {
    res.send("imagine this is a dynamic server-side login action");
  });
};
```

## Sample App Structure

This is a sample directory structure of what a complete app server might look like.

```
.
+--- server.js
+--- sslcert
+--- apps
     +--- alexa-app-1
          +--- package.json
          +--- index.js
          +--- node_modules
     +--- alexa-app-2
          +--- package.json
          +--- index.js
          +--- node_modules
+--- public_html
     +--- index.html
```

## Running in Production

While individual `alexa-app` functions can be deployed to AWS Lambda, the `alexa-app-server` module can be used in both development and production for multiple applications. It will work with the Alexa Service Simulator on [developer.amazon.com](https://developer.amazon.com), a real Echo device, etc.

Choose `HTTPs` in _Service Endpoint Type_ in the Alexa app configuration on [developer.amazon.com](https://developer.amazon.com) and point to one of your apps. For example, [alexa-app-server-hello-world](https://github.com/dblock/alexa-app-server-hello-world) is available at `https://alexa-app-server-hello-world.herokuapp.com/alexa/hello_world`.

Make sure to set `verify: true` and `debug: false` in production environments.

## Examples

See the [example application in the "examples" directory](examples).

# History

See [CHANGELOG](CHANGELOG.md) for details.

# License

Copyright (c) 2016-2017 Matt Kruse

MIT License, see [LICENSE](LICENSE.md) for details.
