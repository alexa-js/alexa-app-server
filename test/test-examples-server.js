/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest-as-promised");

describe("Alexa App Server with Examples", function() {
  var testServer;

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

  it("mounts hello world app", function() {
      return request(testServer.express)
        .get('/alexa/helloworld')
        .expect(200)
  });

  it("mounts number_guessing_game", function() {
      return request(testServer.express)
        .get('/alexa/guessinggame')
        .expect(200)
  });

  it("404s on an invalid app", function() {
      return request(testServer.express)
        .get('/alexa/invalid')
        .expect(404)
  });
});
