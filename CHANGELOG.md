## Changelog

### 3.0.2 (Next)

* Your contribution here.

### 3.0.1 (March 7, 2017)

* [#71](https://github.com/alexa-js/alexa-app-server/pull/71), [#68](https://github.com/alexa-js/alexa-app-server/issues/68): Fixed log output containing multiple slashes - [@tejashah88](https://github.com/tejashah88).
* [#72](https://github.com/alexa-js/alexa-app-server/pull/72): Use `path.join` for constructing relative paths - [@dblock](https://github.com/dblock).
* [#74](https://github.com/alexa-js/alexa-app-server/pull/74): Added locale selector to test page - [@siedi](https://github.com/siedi).
* [#76](https://github.com/alexa-js/alexa-app-server/pull/76): Changed endpoint message to use app name to match route - [@zweiler](https://github.com/zweiler).
* [#79](https://github.com/alexa-js/alexa-app-server/pull/77): Removed router from `app.express()` configuration options - [@rickwargo](https://github.com/rickwargo).

### 3.0.0 (February 6, 2017)

* [#35](https://github.com/alexa-js/alexa-app-server/issues/35): Removed `body-parser`, properly mounted by `alexa-app` - [@dblock](https://github.com/dblock).
* [#21](https://github.com/alexa-js/alexa-app-server/issues/21), [52](https://github.com/alexa-js/alexa-app-server/issues/52): Setting `verify: true` hangs for requests with signature - [@mreinstein](https://github.com/mreinstein), [@dblock](https://github.com/dblock).
* [#61](https://github.com/alexa-js/alexa-app-server/pull/61): Fix: error occurs if HTTP and HTTPs ports specified are the same - [@dblock](https://github.com/dblock).
* [#60](https://github.com/alexa-js/alexa-app-server/pull/60): Added `httpEnabled` that disables HTTP - [@dblock](https://github.com/dblock).
* [#48](https://github.com/alexa-js/alexa-app-server/pull/48): Removed deprecated dependency `supertest-as-promised` - [@tejashah88](https://github.com/tejashah88).
* [#51](https://github.com/alexa-js/alexa-app-server/pull/51): Enable `strictHeaderCheck` in verifier middleware [#50](https://github.com/alexa-js/alexa-app-server/issues/50) - [@mreinstein](https://github.com/mreinstein).
* [#45](https://github.com/alexa-js/alexa-app-server/pull/45), [#17](https://github.com/alexa-js/alexa-app-server/pull/17): Added support for CA chain certificates - [@tejashah88](https://github.com/tejashah88).
* [#45](https://github.com/alexa-js/alexa-app-server/pull/45): Added option to specify passphrase for unlocking specified SSL files - [@tejashah88](https://github.com/tejashah88).
* [#45](https://github.com/alexa-js/alexa-app-server/pull/45): Added npm command to examine test coverage locally - [@tejashah88](https://github.com/tejashah88).
* [#22](https://github.com/alexa-js/alexa-app-server/pull/22): Adding context object to request templates - [@pwbrown](https://github.com/pwbrown).
* [#43](https://github.com/alexa-js/alexa-app-server/pull/43): Test fixes and an actual test for firing pre/post events. - [@dblock](https://github.com/dblock).
* [#37](https://github.com/alexa-js/alexa-app-server/pull/37): Added `host` option to specify host address to bind servers to - [@tejashah88](https://github.com/tejashah88).
* [#36](https://github.com/alexa-js/alexa-app-server/pull/36): Error occurs when `verify` and `debug` are both set to true - [@tejashah88](https://github.com/tejashah88).
* [#34](https://github.com/alexa-js/alexa-app-server/pull/34): Added tests for fail cases and schemas/utterances - [@tejashah88](https://github.com/tejashah88).
* [#34](https://github.com/alexa-js/alexa-app-server/pull/34): Fixed bug while trying to retrieve schema/utterances with GET request - [@tejashah88](https://github.com/tejashah88).
* [#34](https://github.com/alexa-js/alexa-app-server/pull/34): Updated messages that display an error to be displayed by `self.error` - [@tejashah88](https://github.com/tejashah88).
* [#34](https://github.com/alexa-js/alexa-app-server/pull/34): Optimized some tests to not always start a new server instance after every test - [@tejashah88](https://github.com/tejashah88).
* [#33](https://github.com/alexa-js/alexa-app-server/pull/33): Fix: Express.js deprecation warning - [@tejashah88](https://github.com/tejashah88).
* [#32](https://github.com/alexa-js/alexa-app-server/pull/32): Added tests for request verification, HTTPS support, and POST-based routes - [@tejashah88](https://github.com/tejashah88).
* [#32](https://github.com/alexa-js/alexa-app-server/pull/32): Fix: potential memory leaks from not closing the HTTPS server instance and not removing the hotswap listeners - [@tejashah88](https://github.com/tejashah88).
* [#32](https://github.com/alexa-js/alexa-app-server/pull/32): Use `alexa-verifier-middleware` for request verification - [@tejashah88](https://github.com/tejashah88).
* [#32](https://github.com/alexa-js/alexa-app-server/pull/32): Moved `sslcert` folder into examples - [@tejashah88](https://github.com/tejashah88).
* [#32](https://github.com/alexa-js/alexa-app-server/pull/32): Updated documentation for generating the SSL certificate - [@tejashah88](https://github.com/tejashah88).
* [#28](https://github.com/alexa-js/alexa-app-server/pull/28): Moved to the [alexa-js organization](https://github.com/alexa-js) - [@dblock](https://github.com/dblock).
* [#23](https://github.com/alexa-js/alexa-app-server/pull/23): Added `server.stop()` - [@dblock](https://github.com/dblock).
* [#23](https://github.com/alexa-js/alexa-app-server/pull/23): Added tests, code coverage and LICENSE - [@dblock](https://github.com/dblock).
* [#27](https://github.com/alexa-js/alexa-app-server/pull/27): Added Danger, PR linter - [@dblock](https://github.com/dblock).

### 2.3.1 (December 3, 2016)

* Fixed bug caused by custom slot types call - [@matt-kruse](https://github.com/matt-kruse).

### 2.3.0 (November 28, 2016)

* [#2](https://github.com/alexa-js/alexa-app-server/pull/2): Added view for custom slot types - [@rickwargo](https://github.com/rickwargo).
* [#14](https://github.com/alexa-js/alexa-app-server/pull/2): Added support for alexa-verifier - [@TomMettam](https://github.com/TomMettam).

### 2.2.4 (September 13, 2015)

* [#1](https://github.com/alexa-js/alexa-app-server/pull/1): Added HTTPS Support - [@parisbutterfield](https://github.com/parisbutterfield).

### 2.2.3 (August 19, 2015)

* Added the ability to retrieve schema and utterances output directly using url parameters - [@matt-kruse](https://github.com/matt-kruse).

### 2.2.2 (August 18, 2015)

* Changed `preRequest()` and `postRequest()` to allow them to return a `Promise` if they perform async operations - [@matt-kruse](https://github.com/matt-kruse).
