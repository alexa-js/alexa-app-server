# alexa-app-server

An Alexa App (Skill) Server module using Node.js and the [alexa-app](https://www.npmjs.com/package/alexa-app) module

## Installation

	npm install

## Usage

```javascript
var AlexaAppServer = require('alexa-app-server');
AlexaAppServer.start({
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
    post : function(appServer) { }
});
```

## Example App Structure

This is an example directory structure of what a complete app server might look like.

```
.
+--- server.js
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
