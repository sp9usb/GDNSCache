module.exports = exports = function () {
  var dns = require('native-dns');
  var server = dns.createServer();

  return {
    onRequest: function (callback) {
      server.on('request', callback);
    },
    onError: function (callback) {
      function error(error, stack){
        callback(error, stack);
      }

      if (callback) {
        server.on('error', error);
        server.on('socketError', error);
      }
    },
    start: function (port) {
      server.serve(port);
    }
  }
};
