## Changelog

### 2.3.2 (Next)

* [#32](https://github.com/alexa-js/alexa-app-server/pull/32): Bug fixes and more testing/coverage - [@tejashah88](https://github.com/tejashah88)
  * added testing for request verification, HTTPS support, and POST-based routes
  * fixed potential memory leaks from not closing the HTTPS server instance and not removing the hotswap listeners
  * now using alexa-verifier-middleware for request verification
  * changed loading location of contents of 'sslcert' folder (should be part of 'examples' folder)
  * fixed documentation for generating the SSL certificate
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