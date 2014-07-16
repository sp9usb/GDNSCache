module.exports = exports = function (unitOfWork, config) {
  var dns = require('native-dns');
  var logger = require('../logger')();

  return {
    resolveDns: function (domain, type, err, res) {
      function collectingResolvedDnsData(result){
          if (result){
              res(result);
          }
      }

      var question = dns.Question({
        name: domain,
        type: type
      });

      var dnsResolverCollection = [];
      config.DNS_SERVER.forEach(function(dnsServer){
          var req = dns.Request({
              question: question,
              server: {
                  address: dnsServer,
                  port: 53,
                  type: 'udp'
              }
          });

          req.on('timeout', function () {
            err('Request to: ' + dnsServer + ', timeout ' + domain + ' type: ' + type);
          });

          req.on('message', function (error, answer) {
              if (error) {
                  err(error);
              }
              collectingResolvedDnsData(answer);
          });

          dnsResolverCollection.push(req);
      });

      dnsResolverCollection.forEach(function(concreteResolver){
         concreteResolver.send();
      });
    }

  };


};