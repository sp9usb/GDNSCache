module.exports = exports = function () {
  var server = require('native-dns').createServer();

  server.on('end', function(){
      console.log('Closed connection');
  });

  return {
    onRequest: function (callback) {
      server.on('request', function(request, response){
          try {
              if (callback) {
                  callback(request, response);
              } else {
                  throw 'OnRequest callback is not registred!';
              }
          } finally {

          }
      });
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
    start: function (port, dnsServerList) {
      server.serve(port);
    }
  }
};
