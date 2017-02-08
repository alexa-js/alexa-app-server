/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest");
var alexaAppServer = require("../index");
var fs = require("fs");
var utils = require("../utils");

describe("Alexa App Server with Examples & Pre/Post functions", function() {
  var testServer, fired;
  var sampleLaunchReq;

  before(function() {
    fired = {};
    testServer = alexaAppServer.start({
      port: 3000,
      server_root: 'examples',
      pre: function(appServer) {
        fired.pre = true;
      },
      post: function(appServer) {
        fired.post = true;
      },
      preRequest: function(json, request, response) {
        fired.preRequest = true;
      },
      postRequest: function(json, request, response) {
        fired.postRequest = true;
      }
    });

    sampleLaunchReq = utils.readJsonFile("test/sample-launch-req.json");
  });

  after(function() {
    testServer.stop();
  });

  it("mounts hello world app (GET)", function() {
    return request(testServer.express)
      .get('/alexa/hello_world')
      .expect(200).then(function(response) {
        expect(fired.pre).to.equal(true);
        expect(fired.post).to.equal(true);
        // only called for actual Alexa requests
        expect(fired.preRequest).to.equal(undefined);
        expect(fired.postRequest).to.equal(undefined);
      });
  });

  it("mounts hello world app (POST)", function() {
    return request(testServer.express)
      .post('/alexa/hello_world')
      .send(sampleLaunchReq)
      .expect(200).then(function(response) {
        expect(fired.pre).to.equal(true);
        expect(fired.post).to.equal(true);
        expect(fired.preRequest).to.equal(true);
        expect(fired.postRequest).to.equal(true);
      });
  });
});
