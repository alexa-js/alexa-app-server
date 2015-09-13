# alexa-app-server

An Alexa App (Skill) Server module using Node.js and the [alexa-app](https://www.npmjs.com/package/alexa-app) module

## Installation

	npm install

## Usage

```javascript
var AlexaAppServer = require('alexa-app-server');
AlexaAppServer.start({
	server_root:__dirname,     // Path to root
	public_html:"public_html", // Static content
	app_dir:"apps",            // Where alexa-app modules are stored
	app_root:"/alexa/",        // Service root
	port:80                    // What port to use, duh
});
```


## Summary

The alexa-app-server module offers a stand-alone web server to host Alexa Apps (Skills). Think of it as a simple "container" that allows you to easily publish multiple Alexa Apps with one server. The apps themselves are independent modules, written using the [alexa-app](https://www.npmjs.com/package/alexa-app) module framework.

The server can also serve static web site content, and offers a built-in Alexa App debugger/simulator. This allows you to test your skill using a web browser and view the responses, without actually using the Echo.

To be clear: This is the container to easily host multiple apps. This module does not help you write the Alexa Apps (Skills) themselves. That is what the [alexa-app](https://www.npmjs.com/package/alexa-app) module is for.

## Key Points

- Multiple apps can be hosted on a single server
  - Apps are stored in the /apps directory by default
  - Each app is a stand-alone Node module, built using the alexa-app framework
  - Each app must export its alexa-app instance to be loaded into the server
  - package.json contains information about the app, including (optionally) the appId
  - The hotswap module reloads code changes to apps, if they set module.change_code=1
- Built-in Echo Simulator 
  - Debug apps by issuing a GET request to the app endpoints
  - Send simulated requests to your app, view the JSON response
  - Session variables are automatically maintained between requests
  - Send intent requests and set slot values
  - View generated schema and utterances

## Starting The Server

You can either get a reference to an AlexaAppServer instance, or you can use the start() method shortcut. Getting a reference allows you to inspect or change the server object later.

```javascript
var AlexaAppServer = require('alexa-app-server');
var server = new AlexaAppServer( {port:80,debug:false} );
server.start();
server.express.use('/test',function(req,res){ res.send("OK"); });
```

```javascript
var AlexaAppServer = require('alexa-app-server');
AlexaAppServer.start( {port:8080} );
```

## Configuration Options

The start() method accepts a configuration object. The defaults are shown below.

```javascript
require('alexa-app-server').start({
	// In order to start the server from a working directory other than
	// where your server.js file, you need to provide Node the full path 
	// to your server's root directory. The easiest way is to use  __dirname
	server_root : __dirname,
	
	// A directory containing static content to serve as the document root.
    // This directory is relative to the script using alexa-app-server, not 
	// relative to the module directory.
    public_html : "public_html",
    
    // A directory containing Alexa Apps. This directory should contain one 
	// or more subdirectories. Each subdirectory is a stand-alone Alexa App 
	// built with the alexa-app framework. These directories are each 
	// processed during server startup and hooked into the server.
    app_dir : "apps",
    
    // The prefix to use for all Alexa Apps. For example, you may want all 
	// your Alexa endpoints to be accessed under the "/api/" path off the 
	// root of your web server.
    app_root : "/alexa/",
	
	// The directory containing server-side processing modules (see below)
	server_dir : "server",
    
    // The port the server should bind to
    port : 80,
    
    // By default, GET requests to Alexa App endpoints will show the 
	// debugger UI. This can be disabled.
    debug : true,
    
    // By default, some information is logged with console.log(), which can be disabled
    log : true,
    
    // The pre() method is called after the express server has been instantiated, 
	// but before and Alexa Apps have been loaded. It is passed the AlexaAppServer 
	// object itself.
    pre : function(appServer) { },
    
    // The post() method is called after the server has started and the start() method 
	// is ready to exit. It is passed the AlexaAppServer object itself.
    post : function(appServer) { },
	
	// Like pre(), but this function is fired on every request, but before the 
	// application itself gets called. You can use this to load up user details before
	// every request, for example, and insert it into the json request itself for
	// the application to use.
	// If it returns a falsy value, the request json is not changed.
	// If it returns a non-falsy value, the request json is replaced with what was returned.
	// If it returns a Promise, request processing pauses until the Promise resolves.
	//    The value passed on by the promise (if any) replaces the request json.
	preRequest : function(json,request,response) { },
	
	// Like post(), but this function is fired after every request. It has a final 
	// opportunity to modify the JSON response before it is returned back to the
	// Alexa service.
	// If it returns a falsy value, the response json is not changed.
	// If it returns a non-falsy value, the response json is replaced with what was returned.
	// If it returns a Promise, response processing pauses until the Promise resolves.
	//    The value passed on by the promise (if any) replaces the response json.
	postRequest : function(json,request,response) { },
	
	//Enables https support. Note httpsPort, privateKey, and certificate are needed.
	httpsEnabled : true,
	
	//The https port the server will bind to. No default. Must be set if httpsEnable = true
	httpsPort : 443,
	
	//privateKey filename. This file must reside in the sslcert folder under the root of the project. Must be set if httpsEnable = true
	privateKey:'private-key.key',
	
	//certificate filename. This file must reside in the sslcert folder under the root of the project. Must be set if httpsEnable = true
	certificate:'cert.cer'

});
```

## Enabling HTTPS 

You can enable HTTPS support for the app-server using the instructions below.


Generate a x509 SSL Certificate using the following commands:

```
openssl genrsa -out private-key.pem 1024
openssl req -new -x509 -key private-key.pem -out cert.cer -days 365 --generates the certificate
```

Then add the following properties the to config (currently in server.js) that creates the server. Place the two generated files in the sslcert directory.
	
```javascript
AlexaAppServer.start( {
	httpsPort:443,
	httpsEnabled:true,
	privateKey:'private-key.pem',
	certificate:'cert.cer'
	}
} );
```


## Debugging With The Echo Simulator

Each app (skill) is available at a url endpoint on the server, and responds to POST requests from the Echo. If you load an app's endpoint in your browser with a GET request, it will display an echo simulator that can be used to debug your application. With it, you can send different request types to your app, load slots with values you specify, etc and see the actual generated JSON output from your application.

## View Generated Schema And Utterances

In the Echo Simulator, your application's schema definition and example utterances are displayed. These can be directly pasted into the Amazon Developer interface when defining your skill.

You can also get the schema and utterances directly from your endpoint url using url parameters:
```
GET /your/app/endpoint?schema
GET /your/app/endpoint?utterances
```

## Dynamic Server-side Functionality

Most servers will need some server-side processing logic. For example, to handle logins, or process forms, etc. You can specify a directory containing files that define server-side functionality by hooking into express. These files are stand-alone modules that export a single function that the framework calls. An example is below and in the "examples/server/" directory.

The default directory used to hold these modules is "server/" but you can change this by using the "server_dir" configuration parameter, as shown above.

examples/server/login.js

```javascript
module.exports = function(express,alexaAppServerObject) {
	express.use('/login',function(req,res) {
		res.send("Imagine this is a dynamic server-side login action");
	});
};
```

## Example App Structure

This is an example directory structure of what a complete app server might look like.

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

## Examples

See example application in the "examples" directory.

## History

- 2.2.4 - Sep 13, 2015
  - Added HTTPS Support
  
- 2.2.3 - Aug 19, 2015
  - Added the ability to retrieve schema and utterances output directly using url parameters
    - Example: /your/app/endpoint?schema

- 2.2.2 - Aug 18, 2015
  - Changed preRequest() and postRequest() to allow them to return a Promise if they perform async operations
  
