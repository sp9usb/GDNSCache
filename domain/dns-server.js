module.exports = exports = function () {
  var dns = require('native-dns');
  var server = dns.createServer();

  return {
    onRequest: function (callback) {
      server.on('request', callback);
    },
    onError: function (callback) {
      if (callback) {
        server.on('error', callback);
      } else {
        server.on('error', function (err, buff, req, res) {
          console.log(err.stack);
        });
      }
    },
    createResponseRecord: function(question){
      return {
        name: question.name,
        type: question.type,
        class: question.class,
        ttl: 50
      };
    },
    start: function (port) {
      server.serve(port);
    }
  }
};
