/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest");
var alexaAppServer = require("../index");

describe("Alexa App Server with Examples & Custom Server Bindings", function() {
  var testServer;
  var default_NODE_TLS_REJECT_UNAUTHORIZED = process.env.NODE_TLS_REJECT_UNAUTHORIZED;

  beforeEach(function() {
    // used so that testing https requests will work properly
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  });

  afterEach(function() {
    testServer.stop();
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = default_NODE_TLS_REJECT_UNAUTHORIZED;
  });

  it("mounts the hello world app (HTTP only) and bind to the specified address", function() {
    testServer = alexaAppServer.start({
      port: 3000,
      host: "127.0.0.1",
      server_root: 'examples'
    });

    return request("http://127.0.0.1:3000")
      .get('/alexa/hello_world')
      .expect(200);
  });

  it("mounts the hello world app (HTTP & HTTPS) (CA chain file not included) and bind to the specified address", function() {
    testServer = alexaAppServer.start({
      httpsPort: 6000,
      host: "127.0.0.1",
      server_root: 'examples',
      httpsEnabled: true,
      privateKey: 'private-key.pem',
      certificate: 'cert.cer',
      passphrase: 'test123'
    });

    return request("https://127.0.0.1:6000")
      .get('/alexa/hello_world')
      .expect(200);
  });

  it("mounts the hello world app (HTTP & HTTPS) (CA chain file included) and bind to the specified address", function() {
    testServer = alexaAppServer.start({
      httpsPort: 6000,
      host: "127.0.0.1",
      server_root: 'examples',
      httpsEnabled: true,
      privateKey: 'private-key.pem',
      certificate: 'cert.cer',
      chain: 'cert.ca_bundle',
      passphrase: 'test123'
    });

    return request("https://127.0.0.1:6000")
      .get('/alexa/hello_world')
      .expect(200);
  });
});
