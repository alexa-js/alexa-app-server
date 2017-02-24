## Upgrading

### Upgrading to >= 2.4.0

This is the first release out of the [alexa-js Github org](https://github.com/alexa-js).

#### Alexa-app minimum version

A minimum version 3.0.0 of `alexa-app` is now required.

See [alexa-app CHANGELOG](https://github.com/alexa-js/alexa-app/blob/master/CHANGELOG.md) and [UPGRADING](https://github.com/alexa-js/alexa-app/blob/master/UPGRADING.md) for more information.

#### Changes in body-parser middleware

The `.urlencoded` body-parser has been removed. If your application requires it, `use` it from your application code.

The `.json` body-parser is only used for Alexa applications when `alexa-app-server` is started with `verify: false`, because `verifier-middleware`, which is now mounted inside `alexa-app` acts as a body-parser as well.

See [#35](https://github.com/alexa-js/alexa-app-server/issues/35) and [#64](https://github.com/alexa-js/alexa-app-server/pull/64) for more information.