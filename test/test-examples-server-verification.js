/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest");
var alexaAppServer = require("../index");
var fs = require("fs");
var utils = require("../utils");

describe("Alexa App Server with Examples & Verification", function() {
  var testServer;
  var sampleLaunchReq;

  before(function() {
    testServer = alexaAppServer.start({
      port: 3000,
      server_root: 'examples',
      debug: false,
      verify: true
    });

    sampleLaunchReq = utils.readJsonFile("test/sample-launch-req.json");
  });

  after(function() {
    testServer.stop();
  });

  describe("GET requests", function() {
    it("mounts hello world app", function() {
      return request(testServer.express)
        .get('/alexa/hello_world')
        .expect(401);
    });

    it("mounts number_guessing_game app", function() {
      return request(testServer.express)
        .get('/alexa/number_guessing_game')
        .expect(401);
    });
  });

  describe("POST requests", function() {
    it("mounts hello world app", function() {
      return request(testServer.express)
        .post('/alexa/hello_world')
        .send(sampleLaunchReq)
        .expect(401);
    });

    it("mounts number_guessing_game", function() {
      return request(testServer.express)
        .post('/alexa/number_guessing_game')
        .send(sampleLaunchReq)
        .expect(401);
    });

    it("invokes verifier number_guessing_game", function() {
      return request(testServer.express)
        .post('/alexa/number_guessing_game')
        .set('signaturecertchainurl', 'dummy-signature-chain-url')
        .set('signature', 'dummy-signature')
        .send(sampleLaunchReq)
        .expect(401);
    });

    it("invokes verifier number_guessing_game", function() {
      return request(testServer.express)
        .post('/alexa/number_guessing_game')
        .set('signaturecertchainurl', 'dummy-signature-chain-url')
        .set('signature', 'dummy-signature')
        .send(sampleLaunchReq)
        .expect(401);
    });
  });
});
