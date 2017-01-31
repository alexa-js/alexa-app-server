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
        port: 3000,
        server_root: 'invalid_examples',
        debug: true,
        verify: true
      });
    };

    expect(fn).to.throw(Error);
  });
});
