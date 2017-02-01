## Upgrading

### Upgrading to >= Next

#### Changes in HTTPs support

To enable HTTPs use `https: true` instead of `httpsEnabled: true`. Furthermore, `httsPort` is deprecated, the server will no longer bind to both HTTP and HTTPs and will bind to `port` in both cases.

See [#55](https://github.com/alexa-js/alexa-app-server/pull/55) for more information.
