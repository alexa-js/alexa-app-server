/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest");
var alexaAppServer = require("../index");

describe("Alexa App Server", function() {
  it("throws an error when 'debug' and 'verify' are enabled", function() {
    var fn = function() {
      alexaAppServer.start({
        debug: true,
        verify: true
      });
    };

    expect(fn).to.throw(Error, /verify and debug options cannot be both enabled/);
  });

  it("throws an error when 'httpEnabled' and 'httpsEnabled' are both false", function() {
    var fn = function() {
      alexaAppServer.start({
        httpEnabled: false,
        httpsEnabled: false
      });
    };

    expect(fn).to.throw(Error, /either http or https must be enabled/);
  });

  it("throws an error when 'port' and 'httpsPort' are both the same and http and https are enabled", function() {
    var fn = function() {
      alexaAppServer.start({
        port: 3000,
        httpsPort: 3000,
        httpEnabled: true,
        httpsEnabled: true
      });
    };

    expect(fn).to.throw(Error, /http and https ports must be different/);
  });

  it("no errors when 'port' and 'httpsPort' are both the same and either is enabled", function() {
    var testServer;
    var fn = function() {
      testServer = alexaAppServer.start({
        port: 3000,
        httpsPort: 3000
      });
    };

    expect(fn).to.not.throw(Error);

    testServer.stop();
  });

  describe("with defaults", function() {
    var testServer;

    beforeEach(function() {
      testServer = alexaAppServer.start();
    });

    afterEach(function() {
      testServer.stop();
    });

    it("starts an express instance", function() {
      return request(testServer.express)
        .get('/')
        .expect(404);
    });

    it("defaults host to undefined (binds to any available IP)", function() {
      expect(testServer.config.host).to.be.undefined;
    });

    it("defaults port to 8080", function() {
      expect(testServer.config.port).to.equal(8080);
    });

    it("has no defaults for httpsPort", function() {
      expect(testServer.config.httpsPort).to.be.undefined;
    });

    it("defaults serverRoot to .", function() {
      expect(testServer.config.port).to.equal(8080);
    });
  });

  describe("with no host specified", function() {
    var testServer;

    beforeEach(function() {
      testServer = alexaAppServer.start({ host: '127.0.0.1' });
    });

    afterEach(function() {
      testServer.stop();
    });

    it("starts an express instance", function() {
      return request(testServer.express)
        .get('/')
        .expect(404);
    });

    it("connects to 127.0.0.1 only", function() {
      expect(testServer.config.host).to.equal('127.0.0.1');
    });
  });
});
