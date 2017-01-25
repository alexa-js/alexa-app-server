/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest-as-promised");
var alexaAppServer = require("../index");

describe("Alexa App Server with Examples & Verification", function() {
  var testServer;

  before(function() {
    testServer = alexaAppServer.start({
      port: 3000,
      server_root: 'examples',
      verify: true
    });
  });

  after(function() {
    testServer.stop();
  });

  it("mounts hello world app", function() {
      return request(testServer.express)
        .get('/alexa/helloworld')
        .expect(200);
  });

  it("mounts number_guessing_game app", function() {
      return request(testServer.express)
        .get('/alexa/guessinggame')
        .expect(200);
  });

  it("404s on an invalid app", function() {
      return request(testServer.express)
        .get('/alexa/invalid')
        .expect(404);
  });
});