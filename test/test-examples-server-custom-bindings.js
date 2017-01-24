/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest-as-promised");
var alexaAppServer = require("../index");

// used so that testing https requests will work properly
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

describe("Alexa App Server with Examples & Custom Server Bindings", function() {
  var testServer;

  afterEach(function() {
    testServer.stop();
  });

  it("mounts hello world app (HTTP only) and bind to the specified address", function() {
      testServer = alexaAppServer.start({
        port: 3000,
        host: "127.0.0.1",
        server_root: 'examples'
      });

      return request("http://127.0.0.1:3000")
        .get('/alexa/helloworld')
        .expect(200);
  });

  it("mounts hello world app (HTTP & HTTPS) and bind to the specified address", function() {
      testServer = alexaAppServer.start({
        port: 3000,
        host: "127.0.0.1",
        server_root: 'examples',
        httpsEnabled: true,
        httpsPort: 6000,
        privateKey: 'private-key.pem',
        certificate: 'cert.cer'
      });

      return request("https://127.0.0.1:6000")
        .get('/alexa/helloworld')
        .expect(200);
  });
});