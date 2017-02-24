/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest");
var alexaAppServer = require("../index");
var fs = require("fs");
var tcpPortUsed = require('tcp-port-used');
var utils = require("../utils");

describe("Alexa App Server with Examples & more HTTPS support", function() {
  var testServer;
  var sampleLaunchReq;

  before(function() {
    sampleLaunchReq = utils.readJsonFile("test/sample-launch-req.json");
  });

  afterEach(function() {
    testServer.stop();
  });

  describe("no specific address given", function() {
    it("has the HTTP server instance running on default port 8080", function() {
      testServer = alexaAppServer.start({
        server_root: 'examples'
      });

      return request(testServer.express)
        .get('/alexa/hello_world')
        .expect(200).then(function(response) {
          expect(testServer.instance).to.exist;
          return tcpPortUsed.check(8080).then(function(inUse) {
            expect(inUse).to.equal(true);
          });
        });
    });

    it("has the HTTP server instance running on configured port 3000", function() {
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

    it("has the HTTPS server instances running", function() {
      testServer = alexaAppServer.start({
        httpsPort: 6000,
        server_root: 'examples',
        httpsEnabled: true,
        privateKey: 'private-key.pem',
        certificate: 'cert.cer',
        chain: 'cert.ca_bundle',
        passphrase: "test123"
      });

      return request(testServer.express)
        .get('/alexa/hello_world')
        .expect(200).then(function(response) {
          expect(testServer.instance).to.exist;
          expect(testServer.httpsInstance).to.exist;
          return tcpPortUsed.check(6000).then(function(inUse) {
            expect(inUse).to.equal(true);
          });
        });
    });
  });

  describe("on 127.0.0.1", function() {
    it("has the HTTP server instance running", function() {
      testServer = alexaAppServer.start({
        port: 3000,
        host: '127.0.0.1',
        server_root: 'examples'
      });

      return request(testServer.express)
        .get('/alexa/hello_world')
        .expect(200).then(function(response) {
          expect(testServer.instance).to.exist;
          expect(testServer.httpsInstance).to.not.exist;
          return tcpPortUsed.check(3000).then(function(inUse) {
            expect(inUse).to.equal(true);
          });
        });
    });

    it("has both an HTTP and HTTPS server instances running", function() {
      testServer = alexaAppServer.start({
        port: 3000,
        httpsPort: 6000,
        host: '127.0.0.1',
        server_root: 'examples',
        httpsEnabled: true,
        privateKey: 'private-key.pem',
        certificate: 'cert.cer',
        chain: 'cert.ca_bundle',
        passphrase: "test123"
      });

      return request(testServer.express)
        .get('/alexa/hello_world')
        .expect(200).then(function(response) {
          expect(testServer.instance).to.exist;
          expect(testServer.httpsInstance).to.exist;
          return tcpPortUsed.check(6000).then(function(inUse) {
            expect(inUse).to.equal(true);
            return tcpPortUsed.check(3000).then(function(inUse) {
              expect(inUse).to.equal(true);
            });
          });
        });
    });

    it("with httpEnabled = false only starts an HTTPs instance", function() {
      testServer = alexaAppServer.start({
        httpEnabled: false,
        port: 3000,
        httpsPort: 6000,
        host: '127.0.0.1',
        server_root: 'examples',
        httpsEnabled: true,
        privateKey: 'private-key.pem',
        certificate: 'cert.cer',
        chain: 'cert.ca_bundle',
        passphrase: "test123"
      });

      return request(testServer.express)
        .get('/alexa/hello_world')
        .expect(200).then(function(response) {
          expect(testServer.instance).to.not.exist;
          expect(testServer.httpsInstance).to.exist;
          return tcpPortUsed.check(6000).then(function(inUse) {
            expect(inUse).to.equal(true);
            return tcpPortUsed.check(3000).then(function(inUse) {
              expect(inUse).to.equal(false);
            });
          });
        });
    });
  });
});
