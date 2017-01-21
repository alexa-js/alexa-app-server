/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest-as-promised");
var alexaAppServer = require("../index");

describe("Alexa App Server with Examples & Custon Server Bindings", function() {
  var testServer;

  afterEach(function() {
    testServer.stop();
  });

  it("mounts hello world app (HTTP only)", function() {
      testServer = alexaAppServer.start({
        port: 3000,
        host_address: "127.0.0.1",
        server_root: 'examples'
      });
      return request(testServer.express)
        .get('/alexa/helloworld')
        .expect(200);
  });

  it("mounts hello world app (HTTP & HTTPS)", function() {
      testServer = alexaAppServer.start({
        port: 3000,
        host_address: "127.0.0.1",
        server_root: 'examples',
        httpsEnabled: true,
        httpsPort: 6000,
        privateKey: 'private-key.pem',
        certificate: 'cert.cer'
      });

      return request(testServer.express)
        .get('/alexa/helloworld')
        .expect(200);
  });
});