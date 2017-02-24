Releasing
=========

There're no particular rules about when to release alexa-app-server. Release bug fixes frequently, features not so frequently and breaking API changes rarely.

### Release

Run tests, check that all tests succeed locally.

```
npm install
npm test
```

Check that the last build succeeded in [Travis CI](https://travis-ci.org/alexa-js/alexa-app-server).

Those with r/w permissions to the [master alexa-app-server repository](https://github.com/alexa-js/alexa-app-server) generally have alexa-app-server-based projects. Point one to alexa-app-server HEAD and run all your tests to catch any obvious regressions.

```
"dependencies": {
  "alexa-app-server": "alexa-js/alexa-app-server"
}
```

Modify the "Stable Release" section in [README.md](README.md). Change the text to reflect that this is going to be the documentation for a stable release. Remove references to the previous release of alexa-app-server. Keep the file open, you'll have to undo this change after the release.

```
## Stable Release

You're reading the documentation for the stable release of alexa-app-server, 3.0.1.
```

Change "Next Release" in [CHANGELOG.md](CHANGELOG.md) to the new version.

```
### 3.0.1 (Feb 7, 2017)
```

Remove the line with "Your contribution here.", since there will be no more contributions to this release.

Commit your changes.

```
git add README.md CHANGELOG.md
git commit -m "Preparing for release, 3.0.1."
```

Tag the release.

```
git tag v3.0.1
```

Release.

```
$ npm publish
```

Push.

```
$ git push --tags
```

### Prepare for the Next Developer Iteration

Modify the "Stable Release" section in [README.md](README.md). Change the text to reflect that this is going to be the next release.

```
## Stable Release

You're reading the documentation for the next release of alexa-app-server, which should be 3.0.2.
The current stable release is 3.0.1.
```

Add the next release to [CHANGELOG.md](CHANGELOG.md).

```
#### 3.0.2 (Next)

* Your contribution here.
```

Bump the minor version in package.json.

Commit your changes.

```
git add CHANGELOG.md README.md package.json
git commit -m "Preparing for next development iteration, 3.0.2."
git push origin master
```