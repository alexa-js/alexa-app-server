/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest-as-promised");
var fs = require('fs');

describe("Alexa App Server with Examples & Pre/Post functions", function() {
  var testServer;

  var sampleLaunchReq = JSON.parse(fs.readFileSync("test/sample-launch-req.json", 'utf8'));

  before(function() {
    testServer = require("../index").start({
      port: 3000,
      server_root: 'examples',
      pre: function(appServer) { console.log("pre function fired!"); },
      post: function(appServer) { console.log("post function fired!"); },
      preRequest: function(json,request,response) { console.log("preRequest function fired!"); },
      postRequest : function(json,request,response) { console.log("postRequest function fired!"); }
    });
  });

  after(function() {
    testServer.stop();
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
});