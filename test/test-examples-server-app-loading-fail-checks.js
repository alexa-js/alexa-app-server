/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest-as-promised");
var alexaAppServer = require("../index");

describe("Alexa App Server with Examples & App loading fail checking", function() {
  var testServer;

  afterEach(function() {
    testServer.stop();
  });

  it("starts an express instance", function() {
    testServer = alexaAppServer.start({
      port: 3000,
      server_root: 'invalid_examples'
    });

    return request(testServer.express)
      .get('/')
      .expect(200).then(function(response) {
        expect(response.text).to.contain("alexa-app-server is running");
      });
  });
});
