## Changelog

### 2.3.2 (Next)

* [#60](https://github.com/alexa-js/alexa-app-server/pull/60): Added `httpEnabled` that disables HTTP - [@dblock](https://github.com/dblock).
* [#48](https://github.com/alexa-js/alexa-app-server/pull/48): Added more node versions to run mocha tests on Travis-CI - [@tejashah88](https://github.com/tejashah88).
* [#48](https://github.com/alexa-js/alexa-app-server/pull/48): Removed deprecated dependency 'supertest-as-promised' - [@tejashah88](https://github.com/tejashah88).
* [#48](https://github.com/alexa-js/alexa-app-server/pull/48): Added tests to verify that server does not always bind to both HTTP and HTTPS ports [#46](https://github.com/alexa-js/alexa-app-server/issues/46) - [@tejashah88](https://github.com/tejashah88).
* [#48](https://github.com/alexa-js/alexa-app-server/pull/48): Added more node versions to run mocha tests on Travis-CI - [@tejashah88](https://github.com/tejashah88).
* [#51](https://github.com/alexa-js/alexa-app-server/pull/51): Enable `strictHeaderCheck` in verifier middleware [#50](https://github.com/alexa-js/alexa-app-server/issues/50) - [@mreinstein](https://github.com/mreinstein).
* [#45](https://github.com/alexa-js/alexa-app-server/pull/45): Added support for ca chain certificates [#17](https://github.com/alexa-js/alexa-app-server/pull/17) - [@tejashah88](https://github.com/tejashah88).
* [#45](https://github.com/alexa-js/alexa-app-server/pull/45): Added option to specify passphrase for unlocking specified SSL files - [@tejashah88](https://github.com/tejashah88).
* [#45](https://github.com/alexa-js/alexa-app-server/pull/45): Added npm command to examine test coverage locally - [@tejashah88](https://github.com/tejashah88).
* [#22](https://github.com/alexa-js/alexa-app-server/pull/22): Adding Context object to request templates + Refactored debugger files - [@pwbrown](https://github.com/pwbrown).
* [#43](https://github.com/alexa-js/alexa-app-server/pull/43): Test fixes and an actual test for firing pre/post events. - [@dblock](https://github.com/dblock).
* [#36](https://github.com/alexa-js/alexa-app-server/pull/36): Added option to specify host address to bind servers to - [@tejashah88](https://github.com/tejashah88).
* [#35](https://github.com/alexa-js/alexa-app-server/pull/35): Error occurs when `verify` and `debug` are both set to true - [@tejashah88](https://github.com/tejashah88).
* [#34](https://github.com/alexa-js/alexa-app-server/pull/34): Added tests for fail cases and schemas/utterances - [@tejashah88](https://github.com/tejashah88).
* [#34](https://github.com/alexa-js/alexa-app-server/pull/34): Fixed bug while trying to retrieve schema/utterances with GET request - [@tejashah88](https://github.com/tejashah88).
* [#34](https://github.com/alexa-js/alexa-app-server/pull/34): Updated messages that display an error to be displayed by `self.error` - [@tejashah88](https://github.com/tejashah88).
* [#34](https://github.com/alexa-js/alexa-app-server/pull/34): Optimized some tests to not always start a new server instance after every test - [@tejashah88](https://github.com/tejashah88).
* [#33](https://github.com/alexa-js/alexa-app-server/pull/33): Updated dependencies - [@tejashah88](https://github.com/tejashah88).
* [#33](https://github.com/alexa-js/alexa-app-server/pull/33): Fix: expressjs deprecation warning - [@tejashah88](https://github.com/tejashah88).
* [#32](https://github.com/alexa-js/alexa-app-server/pull/32): Added tests for request verification, HTTPS support, and POST-based routes - [@tejashah88](https://github.com/tejashah88).
* [#32](https://github.com/alexa-js/alexa-app-server/pull/32): Fix: potential memory leaks from not closing the HTTPS server instance and not removing the hotswap listeners - [@tejashah88](https://github.com/tejashah88).
* [#32](https://github.com/alexa-js/alexa-app-server/pull/32): Use alexa-verifier-middleware for request verification - [@tejashah88](https://github.com/tejashah88).
* [#32](https://github.com/alexa-js/alexa-app-server/pull/32): Moved 'sslcert' folder into examples - [@tejashah88](https://github.com/tejashah88).
* [#32](https://github.com/alexa-js/alexa-app-server/pull/32): Updated documentation for generating the SSL certificate - [@tejashah88](https://github.com/tejashah88).
* [#28](https://github.com/alexa-js/alexa-app-server/pull/28): Moved to the [alexa-js organization](https://github.com/alexa-js) - [@dblock](https://github.com/dblock).
* [#23](https://github.com/alexa-js/alexa-app-server/pull/23): Added `server.stop()` - [@dblock](https://github.com/dblock).
* [#23](https://github.com/alexa-js/alexa-app-server/pull/23): Added LICENSE - [@dblock](https://github.com/dblock).
* [#23](https://github.com/alexa-js/alexa-app-server/pull/23): Added tests - [@dblock](https://github.com/dblock).
* [#29](https://github.com/alexa-js/alexa-app-server/pull/29): Added code coverage - [@dblock](https://github.com/dblock).
* [#27](https://github.com/alexa-js/alexa-app-server/pull/27): Added Danger, PR linter - [@dblock](https://github.com/dblock).
* Your contribution here.

### 2.3.1 (Dec 3, 2016)

* Fixed bug caused by custom slot types call - [@matt-kruse](https://github.com/matt-kruse).

### 2.3.0 (Nov 28, 2016)

* [#2](https://github.com/alexa-js/alexa-app-server/pull/2): Added view for custom slot types - [@rickwargo](https://github.com/rickwargo).
* [#14](https://github.com/alexa-js/alexa-app-server/pull/2): Added support for alexa-verifier - [@TomMettam](https://github.com/TomMettam).

### 2.2.4 (Sep 13, 2015)

* [#1](https://github.com/alexa-js/alexa-app-server/pull/1): Added HTTPS Support - [@parisbutterfield](https://github.com/parisbutterfield).

### 2.2.3 (Aug 19, 2015)

* Added the ability to retrieve schema and utterances output directly using url parameters - [@matt-kruse](https://github.com/matt-kruse).

### 2.2.2 (Aug 18, 2015)

* Changed `preRequest()` and `postRequest()` to allow them to return a `Promise` if they perform async operations - [@matt-kruse](https://github.com/matt-kruse).
