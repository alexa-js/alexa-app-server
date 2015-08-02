var AlexaAppServer = require("../index.js");
AlexaAppServer.start( {
	port:8080
	// Use preRequest to load user data on each request and add it to the request json.
	// In reality, this data would come from a db or files, etc.
	,preRequest: function(json,req,res) {
		console.log("preRequest fired");
		json.userDetails = { "name":"Bob Smith" };
	}
	// Add a dummy attribute to the response
	,postRequest: function(json,req,res) {
		json.dummy = "text";
	}
} );
