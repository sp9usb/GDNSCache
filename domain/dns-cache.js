module.exports = exports = function (unitOfWork, config) {
  var dns = require('native-dns');
  var logger = require('../logger')();

  return {
    resolveDns: function (domain, type, err, res) {
      function nextDnsServer(currentDns){
        var indexOfCurrentDns = config.DNS_SERVER.indexOf(currentDns);
        if (indexOfCurrentDns < config.DNS_SERVER.length-1){
          return config.DNS_SERVER[indexOfCurrentDns+1];
        } else {
          return null;
        }
      }

      var masterDns = config.DNS_SERVER[0];
      var question = dns.Question({
        name: domain,
        type: type
      });

      var req = dns.Request({
        question: question,
        server: {
          address: masterDns,
          port: 53,
          type: 'udp'
        }
      });

      req.on('timeout', function () {
        var lastDns = req.server.address;
        var masterDns = nextDnsServer(lastDns);
        if (masterDns) {

          logger.info('Request to: ' + lastDns + ', next DNS in queue: '+masterDns);
          req.server.address = masterDns;
          req.send();
        }else {
          err('timeout ' + domain + ' type: ' + type);
        }
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