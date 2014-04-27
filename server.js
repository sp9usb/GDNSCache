var dns = require('native-dns');
var unitOfWork = require('./unitOfWork')();
var server = require('./domain/dns-cache')(dns, unitOfWork);

server.onRequest(function (request, response) {
    if (!request.question){
        return;
    }
    request.question.forEach(function(question){
        console.log(question);
        var domain = question.name;
        var type = question.type;

        var result = unitOfWork.inMemory.get(domain, type);
        if (!result){
          console.log('Record not found.');
          server.resolveDns(domain, type, function(error){
            console.log('Error =>'+JSON.stringify(error));
          },
          function(addresses){
            addresses.forEach(function(address){
              unitOfWork.inMemory.push(domain, type, address);

              response.answer.push(createDnsRecord(domain, address, type));
            });
          });
        } else {
          result.forEach(function(address){
            response.answer.push(createDnsRecord(domain, address, type));
          });
        }

        console.log('Database size: '+unitOfWork.inMemory.dnsResults.length);

  });

  response.send();
});

server.start(53);