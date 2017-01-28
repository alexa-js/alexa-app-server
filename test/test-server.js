/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest-as-promised");
var alexaAppServer = require("../index");

describe("Alexa App Server", function() {
  var testServer;

  before(function() {
    testServer = alexaAppServer.start({
      port: 3000
    });
  });

  after(function() {
    testServer.stop();
  });

  it("starts an express instance", function() {
    return request(testServer.express)
      .get('/')
      .expect(404);
  });
});
