/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest");
var alexaAppServer = require("../index");
var fs = require("fs");

describe("Alexa App Server with Examples", function() {
  var testServer;
  var sampleLaunchReq, sampleUtterances, sampleSchema;

  before(function() {
    testServer = alexaAppServer.start({
      port: 3000,
      server_root: 'examples'
    });

    sampleLaunchReq = JSON.parse(fs.readFileSync("test/sample-launch-req.json", 'utf8'));
    sampleUtterances = fs.readFileSync("test/sample-utterances.txt", 'utf8');
    sampleSchema = fs.readFileSync("test/sample-schema.txt", 'utf8');
  });

  after(function() {
    testServer.stop();
  });

  it("starts an express instance", function() {
    return request(testServer.express)
      .get('/')
      .expect(200).then(function(response) {
        expect(response.text).to.contain("alexa-app-server is running");
      });
  });

  describe("GET requests", function() {
    it("mounts hello world app", function() {
      return request(testServer.express)
        .get('/alexa/helloworld')
        .expect(200);
    });

    it("mounts number_guessing_game", function() {
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

  describe("POST requests", function() {
    it("mounts hello world app", function() {
      return request(testServer.express)
        .post('/alexa/helloworld')
        .send(sampleLaunchReq)
        .expect(200);
    });

    it("mounts number_guessing_game", function() {
      return request(testServer.express)
        .post('/alexa/guessinggame')
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

  describe("schema and utterances", function() {
    it("returns the schema of the hello world app", function() {
      return request(testServer.express)
        .get('/alexa/helloworld?schema')
        .expect(200).then(function(res) {
          expect(res.text).to.equal.sampleSchema;
        });
    });

    it("returns the utterances of the hello world app", function() {
      return request(testServer.express)
        .get('/alexa/helloworld?utterances')
        .expect(200).then(function(res) {
          expect(res.text).to.equal.sampleUtterances;
        });
    });
  });
});
