/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest");
var alexaAppServer = require("../index");
var fs = require("fs");
var utils = require("../utils");

describe("Alexa App Server with Examples & AppId query", function() {
    var testServer;

    afterEach(function() {
        testServer.stop();
    });

    describe("GET requests", function() {
        it("appid is queryable for hello_world example, when server is not in production", function() {
            testServer = alexaAppServer.start({
                port: 3000,
                server_root: 'examples',
                verify: false
            });
            return request(testServer.express)
                .get('/alexa/hello_world/appid')
                .expect(200).then(function(response) {
                    return expect(response.body.id).to.not.be.undefined;
                });
        });

        it("appid is not queryable for hello_world example, when server is in production", function() {
            testServer = alexaAppServer.start({
                port: 3000,
                server_root: 'examples',
                debug: false,
                verify: true
            });
            return request(testServer.express)
                .get('/alexa/hello_world/appid')
                .expect(401);
        });
    });
});
