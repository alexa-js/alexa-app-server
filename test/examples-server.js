var testServer = require("../index");
var expressServer;

testServer.start({
  port: 3000,
  server_root: 'examples',
  post: function(server) {
    expressServer = server.express;
  }
});

module.exports = expressServer;
