/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest");
var alexaAppServer = require("../index");
var fs = require("fs");

describe("Alexa App Server with Examples & Verification", function() {
  var testServer;
  var sampleLaunchReq;

  before(function() {
    testServer = alexaAppServer.start({
      port: 3000,
      server_root: 'examples',
      verify: true
    });

    sampleLaunchReq = JSON.parse(fs.readFileSync("test/sample-launch-req.json", 'utf8'));
  });

  after(function() {
    testServer.stop();
  });

  describe("GET requests", function() {
    it("mounts hello world app", function() {
      return request(testServer.express)
        .get('/alexa/helloworld')
        .expect(401);
    });

    it("mounts number_guessing_game app", function() {
      return request(testServer.express)
        .get('/alexa/guessinggame')
        .expect(401);
    });
  });

  describe("POST requests", function() {
    it("mounts hello world app", function() {
      return request(testServer.express)
        .post('/alexa/helloworld')
        .send(sampleLaunchReq)
        .expect(401);
    });

    it("mounts number_guessing_game", function() {
      return request(testServer.express)
        .post('/alexa/guessinggame')
        .send(sampleLaunchReq)
        .expect(401);
    });
  });
});
