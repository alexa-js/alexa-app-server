/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest");
var alexaAppServer = require("../index");

describe("Alexa App Server with Examples & HTTPS fail checking", function() {
  var testServer;

  afterEach(function() {
    testServer.stop();
  });

  it("fails to mount due to missing HTTPS parameters", function() {
    testServer = alexaAppServer.start({
      httpsPort: 3000,
      server_root: 'invalid_examples',
      httpsEnabled: true
    });

    expect(testServer.httpsInstance).to.not.exist;
  });

  it("fails to mount due to invalid private key and certificate", function() {
    testServer = alexaAppServer.start({
      httpsPort: 6000,
      server_root: 'invalid_examples',
      httpsEnabled: true,
      privateKey: 'invalid-private-key.pem',
      certificate: 'invalid-cert.cer'
    });

    expect(testServer.httpsInstance).to.not.exist;
  });

  it("fails to mount due to invalid CA chain file", function() {
    testServer = alexaAppServer.start({
      httpsPort: 6000,
      server_root: 'invalid_examples',
      httpsEnabled: true,
      privateKey: 'private-key.pem',
      certificate: 'cert.cer',
      chain: 'invalid-cert.ca_bundle'
    });

    expect(testServer.httpsInstance).to.not.exist;
  });

  it("fails to mount due to no passphrase given", function() {
    testServer = alexaAppServer.start({
      httpsPort: 6000,
      server_root: 'invalid_examples',
      httpsEnabled: true,
      privateKey: 'private-key.pem',
      certificate: 'cert.cer',
      chain: 'cert.ca_bundle'
    });

    expect(testServer.httpsInstance).to.not.exist;
  });

  it("fails to mount due to invalid passphrase", function() {
    testServer = alexaAppServer.start({
      httpsPort: 6000,
      server_root: 'invalid_examples',
      httpsEnabled: true,
      privateKey: 'private-key.pem',
      certificate: 'cert.cer',
      chain: 'cert.ca_bundle',
      passphrase: "test321"
    });

    expect(testServer.httpsInstance).to.not.exist;
  });

  // binding to port -1 seems to behave differently on versions of node < 6
  xit("fails to mount due to invalid port", function() {
    testServer = alexaAppServer.start({
      httpsPort: -1,
      server_root: 'invalid_examples',
      httpsEnabled: true,
      privateKey: 'private-key.pem',
      certificate: 'cert.cer',
      passphrase: "test123"
    });

    expect(testServer.httpsInstance).to.not.exist;
  });
});
