/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest");
var alexaAppServer = require("../index");

describe("Alexa App Server with invalid examples", function() {
  var testServer;

  afterEach(function() {
    testServer.stop();
  });

  it("starts without loading invalid apps", function() {
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
