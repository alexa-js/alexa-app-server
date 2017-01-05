/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest-as-promised");

describe("Alexa App Server", function() {
  var testServer;

  beforeEach(function() {
    testServer = require("../index").start({
      port: 3000
    });
  });

  afterEach(function() {
    testServer.stop();
  });

  it("starts an express instance", function() {
      return request(testServer.express)
        .get('/')
        .expect(404);
  });
});
