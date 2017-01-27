/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest-as-promised");
var fs = require('fs');
var alexaAppServer = require("../index");

describe("Alexa App Server with Examples", function() {
  var testServer;

  var sampleLaunchReq = JSON.parse(fs.readFileSync("test/sample-launch-req.json", 'utf8'));
  var sampleUtterances = fs.readFileSync("test/sample-utterances.txt", 'utf8');
  var sampleSchema = fs.readFileSync("test/sample-schema.txt", 'utf8');

  before(function() {
    testServer = alexaAppServer.start({
      port: 3000,
      server_root: 'examples'
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
      });
  });

  it("mounts hello world app (GET)", function() {
    return request(testServer.express)
      .get('/alexa/helloworld')
      .expect(200);
  });

  it("mounts hello world app (POST)", function() {
    return request(testServer.express)
      .post('/alexa/helloworld')
      .send(sampleLaunchReq)
      .expect(200);
  });

  it("mounts number_guessing_game (GET)", function() {
    return request(testServer.express)
      .get('/alexa/guessinggame')
      .expect(200);
  });

  it("mounts number_guessing_game (POST)", function() {
    return request(testServer.express)
      .post('/alexa/guessinggame')
      .send(sampleLaunchReq)
      .expect(200);
  });

  it("404s on an invalid app (GET)", function() {
    return request(testServer.express)
      .get('/alexa/invalid')
      .expect(404);
  });

  it("404s on an invalid app (POST)", function() {
    return request(testServer.express)
      .post('/alexa/invalid')
      .send(sampleLaunchReq)
      .expect(404);
  });

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
