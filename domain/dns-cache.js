module.exports = exports = function (unitOfWork) {
  var dns = require('native-dns');
  var unitOfWork = unitOfWork;

  return {
    resolveDns: function (domain, type, err, res) {
      var question = dns.Question({
        name: domain,
        type: type
      });

      var req = dns.Request({
        question: question,
        server: {
          address: '8.8.8.8',
          port: 53,
          type: 'udp'
        }
      });

      req.on('timeout', function () {
        err('timeout');
      });

      req.on('message', function (error, answer) {
        if (error) {
          err(error);
        }
        res(answer);
      });

      req.send();
    }

  };


};