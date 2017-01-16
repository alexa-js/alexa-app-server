/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest-as-promised");

describe("Alexa App Server with Examples & App loading fail checking", function() {
  var testServer;

  before(function() {
    testServer = require("../index").start({
      port: 3000,
      server_root: 'invalid_examples'
    });
  });

  after(function() {
    testServer.stop();
  });

  it("starts an express instance", function() {
      return request(testServer.express)
        .get('/')
        .expect(200).then(function(response) {
          expect(response.text).to.contain("alexa-app-server is running");
        }
      );
  });
});