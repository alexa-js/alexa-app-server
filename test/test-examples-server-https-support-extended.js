/*jshint expr: true*/
"use strict";
var chai = require("chai");
var expect = chai.expect;
chai.config.includeStack = true;
var request = require("supertest");
var alexaAppServer = require("../index");
var fs = require("fs");

describe("Alexa App Server with Examples & more HTTPS support", function() {
  var testServer;
  var sampleLaunchReq;

  function isPortTaken(config, fn) {
    var port = config.port;
    var address = config.host;

    var success_ix = 0;
    var net = require('net');

    var test_ipv4 = net.createServer()
      .once('error', function(err) {
        if (err.code != 'EADDRINUSE')
          return fn(err)
        fn(null, true);
      })
      .once('listening', function() {
        test_ipv4.once('close', function() {
          success_ix++;
          if (success_ix == 2)
            fn(null, false);
        })
        .close()
      })
      .listen(port, (address !== undefined) ? address : '0.0.0.0');

    var test_ipv6 = net.createServer()
      .once('error', function (err) {
        if (err.code != 'EADDRINUSE')
          return fn(err)
        fn(null, true)
      })
      .once('listening', function() {
        test_ipv6.once('close', function() {
          success_ix++;
          if (success_ix == 2)
            fn(null, false)
        })
        .close()
      })
      .listen(port, (address !== undefined) ? '::1' : '::');
  };

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
        .get('/alexa/helloworld')
        .expect(200).then(function(response) {
          // First, check that the actual server instances exist or not
          expect(testServer.httpInstance).to.exist;
          expect(testServer.httpsInstance).to.not.exist;

          // Then, check if the ports are actually bound or not
          isPortTaken({ port: 3000 }, function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.be.true;

            isPortTaken({ port: 6000 }, function(err, result) {
              expect(err).to.not.exist;
              expect(result).to.be.false;
            });
          });
        });
    });

    it("should have the HTTP and HTTPS server instances running", function() {
      testServer = alexaAppServer.start({
        port: 3000,
        server_root: 'examples',
        httpsEnabled: true,
        httpsPort: 6000,
        privateKey: 'private-key.pem',
        certificate: 'cert.cer',
        chain: 'cert.ca_bundle',
        passphrase: "test123"
      });

      return request(testServer.express)
        .get('/alexa/helloworld')
        .expect(200).then(function(response) {
          // First, check that the actual server instances exist or not
          expect(testServer.httpInstance).to.exist;
          expect(testServer.httpsInstance).to.exist;

          // Then, check if the ports are actually bound or not
          isPortTaken({ port: 3000 }, function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.be.true;

            isPortTaken({ port: 3000 }, function(err, result) {
              expect(err).to.not.exist;
              expect(result).to.be.true;
            });
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
        .get('/alexa/helloworld')
        .expect(200).then(function(response) {
          // First, check that the actual server instances exist or not
          expect(testServer.httpInstance).to.exist;
          expect(testServer.httpsInstance).to.not.exist;

          // Then, check if the ports are actually bound or not
          isPortTaken({ port: 3000, host: '127.0.0.1' }, function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.be.true;

            isPortTaken({ port: 6000, host: '127.0.0.1' }, function(err, result) {
              expect(err).to.not.exist;
              expect(result).to.be.false;
            });
          });
        });
    });

    it("should have the HTTP and HTTPS server instances running", function() {
      testServer = alexaAppServer.start({
        port: 3000,
        host: '127.0.0.1',
        server_root: 'examples',
        httpsEnabled: true,
        httpsPort: 6000,
        privateKey: 'private-key.pem',
        certificate: 'cert.cer',
        chain: 'cert.ca_bundle',
        passphrase: "test123"
      });

      return request(testServer.express)
        .get('/alexa/helloworld')
        .expect(200).then(function(response) {
          // First, check that the actual server instances exist or not
          expect(testServer.httpInstance).to.exist;
          expect(testServer.httpsInstance).to.exist;

          // Then, check if the ports are actually bound or not
          isPortTaken({ port: 3000, host: '127.0.0.1' }, function(err, result) {
            expect(err).to.not.exist;
            expect(result).to.be.true;

            isPortTaken({ port: 3000, host: '127.0.0.1' }, function(err, result) {
              expect(err).to.not.exist;
              expect(result).to.be.true;
            });
          });
        });
    });
  });
});