/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest");
var alexaAppServer = require("../index");
var fs = require("fs");
var utils = require("../utils");

describe("Alexa App Server with Examples & HTTPS support", function() {
  var testServer;
  var sampleLaunchReq;

  before(function() {
    testServer = alexaAppServer.start({
      port: 3000,
      server_root: 'examples',
      httpsEnabled: true,
      httpsPort: 6000,
      privateKey: 'private-key.pem',
      certificate: 'cert.cer',
      chain: 'cert.ca_bundle',
      passphrase: "test123"
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
        .expect(200);
    });

    it("mounts number_guessing_game", function() {
      return request(testServer.express)
        .get('/alexa/number_guessing_game')
        .expect(200);
    });

    it("404s on an invalid app", function() {
      return request(testServer.express)
        .get('/alexa/invalid')
        .expect(404);
    });
  });

  describe("POST requests", function() {
    it("mounts hello world app", function() {
      return request(testServer.express)
        .post('/alexa/hello_world')
        .send(sampleLaunchReq)
        .expect(200);
    });

    it("mounts number_guessing_game", function() {
      return request(testServer.express)
        .post('/alexa/number_guessing_game')
        .send(sampleLaunchReq)
        .expect(200);
    });

    it("404s on an invalid app", function() {
      return request(testServer.express)
        .post('/alexa/invalid')
        .send(sampleLaunchReq)
        .expect(404);
    });
  });
});
