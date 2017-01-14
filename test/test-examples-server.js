/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest-as-promised");

describe("Alexa App Server with Examples", function() {
  var testServer;

  var sampleLaunchReq = {
    "version": "1.0",
    "session": {
      "new": true,
      "sessionId": "amzn1.echo-api.session.abeee1a7-aee0-41e6-8192-e6faaed9f5ef",
      "application": {
        "applicationId": "amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe"
      },
      "attributes": {},
      "user": {
        "userId": "amzn1.account.AM3B227HF3FAM1B261HK7FFM3A2"
      }
    },
    "request": {
      "type": "LaunchRequest",
      "requestId": "amzn1.echo-api.request.9cdaa4db-f20e-4c58-8d01-c75322d6c423",
      "timestamp": "2015-05-13T12:34:56Z"
    }
  };

  beforeEach(function() {
    testServer = require("../index").start({
      port: 3000,
      server_root: 'examples'
    });
  });

  afterEach(function() {
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

  it("mounts hello world app (GET)", function() {
      return request(testServer.express)
        .get('/alexa/helloworld')
        .expect(200)
  });

  it("mounts hello world app (POST)", function() {
      return request(testServer.express)
        .post('/alexa/helloworld')
        .send(sampleLaunchReq)
        .expect(200)
  });

  it("mounts number_guessing_game (GET)", function() {
      return request(testServer.express)
        .get('/alexa/guessinggame')
        .expect(200)
  });

  it("mounts number_guessing_game (POST)", function() {
      return request(testServer.express)
        .post('/alexa/guessinggame')
        .send(sampleLaunchReq)
        .expect(200)
  });

  it("404s on an invalid app (GET)", function() {
      return request(testServer.express)
        .get('/alexa/invalid')
        .expect(404)
  });

  it("404s on an invalid app (POST)", function() {
      return request(testServer.express)
        .post('/alexa/invalid')
        .send(sampleLaunchReq)
        .expect(404)
  });
});
