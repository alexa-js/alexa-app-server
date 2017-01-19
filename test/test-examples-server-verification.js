/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest-as-promised");

describe("Alexa App Server with Examples & Verification", function() {
  var testServer;

  before(function() {
    testServer = require("../index").start({
      port: 3000,
      server_root: 'examples',
      verify: true
    });
  });

  after(function() {
    testServer.stop();
  });

  it("404s since the debugger should be disabled", function() {
      return request(testServer.express)
        .get('/alexa/helloworld')
        .expect(404);
  });

  it("404s since the debugger should be disabled", function() {
      return request(testServer.express)
        .get('/alexa/guessinggame')
        .expect(404);
  });

  it("404s on an invalid app", function() {
      return request(testServer.express)
        .get('/alexa/invalid')
        .expect(404);
  });
});