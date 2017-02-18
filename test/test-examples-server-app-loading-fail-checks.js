/*jshint expr: true*/
"use strict";
var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest");
var alexaAppServer = require("../index");

describe("Alexa App Server with invalid examples", function() {
  var testServer;

  afterEach(function() {
    testServer.stop();
    console.log.restore();
  });

  it("starts without loading invalid apps", function() {
    sinon.spy(console, 'log');
    testServer = alexaAppServer.start({
      port: 3000,
      server_root: 'invalid_examples'
    });

    var badAppNameMismatch = '   loaded app [bad_app_name-mismatch] at endpoint: /alexa/bad_app_name_mismatch';
    expect(console.log).to.have.been.calledWithExactly(badAppNameMismatch);

    return request(testServer.express)
      .get('/')
      .expect(200).then(function(response) {
        expect(response.text).to.contain("alexa-app-server is running");
      });
  });
});
