/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest-as-promised");
var alexaAppServer = require("../index");

describe("Alexa App Server with Examples & HTTPS fail checking", function() {
  var testServer;

  afterEach(function() {
    testServer.stop();
  });

  it("fails to mount due to missing HTTPS parameters", function() {
    testServer = alexaAppServer.start({
      port: 3000,
      server_root: 'invalid_examples',
      httpsEnabled: true
    });

    return request(testServer.express)
      .get('/')
      .expect(200).then(function(response) {
        expect(response.text).to.contain("alexa-app-server is running");
      });
  });

  it("fails to mount due to invalid private key and certificate", function() {
      testServer = alexaAppServer.start({
        port: 3000,
        server_root: 'invalid_examples',
        httpsEnabled: true,
        httpsPort: 6000,
        privateKey: 'invalid-private-key.pem',
        certificate: 'invalid-cert.cer'
      });

      return request(testServer.express)
        .get('/')
        .expect(200).then(function(response) {
          expect(response.text).to.contain("alexa-app-server is running");
        }
      );
  });

  it("fails to mount due to invalid CA chain file", function() {
      testServer = alexaAppServer.start({
        port: 3000,
        server_root: 'invalid_examples',
        httpsEnabled: true,
        httpsPort: 6000,
        privateKey: 'private-key.pem',
        certificate: 'cert.cer',
        chain: 'invalid-cert.ca_bundle'
      });
  });

  it("fails to mount due to invalid passphrase", function() {
      testServer = alexaAppServer.start({
        port: 3000,
        server_root: 'invalid_examples',
        httpsEnabled: true,
        httpsPort: 6000,
        privateKey: 'private-key.pem',
        certificate: 'cert.cer',
        chain: 'cert.ca_bundle',
        passphrase: "test321"
      });
  });

  it("fails to mount due to invalid port", function() {
    testServer = alexaAppServer.start({
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
      });
  });
});
