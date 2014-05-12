var config = require('./config');
var unitOfWork = require('./unitOfWork')(config);
var dnsCache = require('./domain/dns-cache')(unitOfWork, config);
var server = require('./domain/dns-server')();

server.onRequest(function (request, response) {
  if (!request.question){
      return;
  }
  request.question.forEach(function(question){
      var domain = question.name;
      var type = question.type;

      console.log('Question of '+domain+' type: '+type);

      var result = unitOfWork.inMemory.get(domain, type);
      if (!result){
        console.log('Record not found.');
        dnsCache.resolveDns(domain, type, function(error){
          console.log('Error =>'+JSON.stringify(error));
        },
        function(answer){
          response.authority = answer.authority;
          response.answer = answer.answer;

          try {
            response.send();
            unitOfWork.inMemory.push(domain, type, answer);
          }catch(ex){
            console.log('Domain: '+domain+', type: '+type+', exception: '+ex);
          }
        });
      } else {
        response.authority = result.authority;
        response.answer = result.answer;
        response.send();
      }

      console.log('Database size: '+unitOfWork.inMemory.getCacheSize());

  });
});

server.onError(function(error, stack){
  console.error('Error: '+error+' => stack: '+stack);
});

server.start(53);