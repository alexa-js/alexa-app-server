/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest");
var alexaAppServer = require("../index");
var fs = require("fs");
var tcpPortUsed = require('tcp-port-used');

describe("Alexa App Server with Examples & more HTTPS support", function() {
  var testServer;
  var sampleLaunchReq;

  before(function() {
    sampleLaunchReq = JSON.parse(fs.readFileSync("test/sample-launch-req.json", 'utf8'));
  });

  afterEach(function() {
    testServer.stop();
  });

  describe("No specific address given", function() {
    it("should only have the HTTP server instance running", function() {
      testServer = alexaAppServer.start({
        port: 3000,
        server_root: 'examples'
      });

      return request(testServer.express)
        .get('/alexa/hello_world')
        .expect(200).then(function(response) {
          expect(testServer.instance).to.exist;
          return tcpPortUsed.check(3000).then(function(inUse) {
            expect(inUse).to.equal(true);
          });
        });
    });

    it("should have an HTTPS server instances running", function() {
      testServer = alexaAppServer.start({
        port: 3000,
        server_root: 'examples',
        https: true,
        privateKey: 'private-key.pem',
        certificate: 'cert.cer',
        chain: 'cert.ca_bundle',
        passphrase: "test123"
      });

      return request(testServer.express)
        .get('/alexa/hello_world')
        .expect(200).then(function(response) {
          expect(testServer.instance).to.exist;
          return tcpPortUsed.check(3000).then(function(inUse) {
            expect(inUse).to.equal(true);
          });
        });
    });
  });

  describe("Specific address given (127.0.0.1)", function() {
    it("should only have the HTTP server instance running", function() {
      testServer = alexaAppServer.start({
        port: 3000,
        host: '127.0.0.1',
        server_root: 'examples'
      });

      return request(testServer.express)
        .get('/alexa/hello_world')
        .expect(200).then(function(response) {
          expect(testServer.instance).to.exist;
          return tcpPortUsed.check(3000).then(function(inUse) {
            expect(inUse).to.equal(true);
          });
        });
    });

    it("should have an HTTPS server instances running", function() {
      testServer = alexaAppServer.start({
        port: 6000,
        host: '127.0.0.1',
        server_root: 'examples',
        https: true,
        privateKey: 'private-key.pem',
        certificate: 'cert.cer',
        chain: 'cert.ca_bundle',
        passphrase: "test123"
      });

      return request(testServer.express)
        .get('/alexa/hello_world')
        .expect(200).then(function(response) {
          expect(testServer.instance).to.exist;
          return tcpPortUsed.check(6000).then(function(inUse) {
            expect(inUse).to.equal(true);
          });
        });
    });
  });
});
