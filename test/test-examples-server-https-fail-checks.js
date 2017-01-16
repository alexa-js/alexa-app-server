/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest-as-promised");

describe("Alexa App Server with Examples & HTTPS fail checking", function() {
  var testServer;

  afterEach(function() {
    testServer.stop();
  });

  it("fails to mount due to missing HTTPS parameters", function() {
      testServer = require("../index").start({
        port: 3000,
        server_root: 'invalid_examples',
        httpsEnabled: true
      });

      return request(testServer.express)
        .get('/')
        .expect(200).then(function(response) {
          expect(response.text).to.contain("alexa-app-server is running");
        }
      );
  });

  it("fails to mount due to invalid credential files", function() {
      testServer = require("../index").start({
        port: 3000,
        server_root: 'invalid_examples',
        httpsEnabled: true,
        httpsPort: 6000,
        privateKey: 'pr1vat3-k3y.p3m',
        certificate: 'c3rt.c3r'
      });
      
      return request(testServer.express)
        .get('/')
        .expect(200).then(function(response) {
          expect(response.text).to.contain("alexa-app-server is running");
        }
      );
  });

  it("fails to mount due to invalid port", function() {
      testServer = require("../index").start({
        port: 3000,
        server_root: 'invalid_examples',
        httpsEnabled: true,
        httpsPort: -1,
        privateKey: 'private-key.pem',
        certificate: 'cert.cer'
      });
      
      return request(testServer.express)
        .get('/')
        .expect(200).then(function(response) {
          expect(response.text).to.contain("alexa-app-server is running");
        }
      );
  });
});