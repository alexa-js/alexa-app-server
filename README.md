# alexa-app-server

An example Alexa App Server using Node.js and the [alexa-app](https://www.npmjs.com/package/alexa-app) module

# Installation

	npm install

# Usage

	supervisor server.js

# Summary

This is an example server for multiple Alexa apps (skills) using the alexa-app module. View server.js for the code.

# Features

- Multiple apps in a single container
  - Apps are stored in the /apps directory
  - Each app is a stand-alone Node module
  - Each app must export its alexa-app instance to be loaded into the server
  - package.json contains information about the app, including (optionally) the appId
- Two example apps
  - Open /helloworld or /guessinggame in your browser
- Built-in Echo Simulator 
  - Debug apps by issuing a GET request to the example app endpoints
  - Send requests to your app, view the response
  - Session variables are automatically maintained between requests
  - Send intent requests and set slot values
  - View generated schema and utterances
- The hotswap module reloads code changes to application files
  
# Examples

See example applications in the apps directory.
