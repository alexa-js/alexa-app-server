/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest");
var alexaAppServer = require("../index");

describe("Alexa App Server with Examples & App loading fail checking", function() {
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
});
