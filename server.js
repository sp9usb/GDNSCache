var config = require('./config');
var unitOfWork = require('./unitOfWork')(config);
var dnsCache = require('./domain/dns-cache')(unitOfWork, config);
var server = require('./domain/dns-server')();
var logger = require('./logger')();
var domain = require('domain').create();

domain.on('error', function(err){
   logger.warn(err);
});
domain.run(function(){
    server.onRequest(function (request, response) {
        if (!request.question){
            return;
        }
        request.question.forEach(function(question){
            var domain = question.name;
            var type = question.type;

            logger.info('Question of '+domain+' type: '+type);
            console.log('Before memory');
            var result = unitOfWork.inMemory.get(domain, type);
            console.log('After memory');
            if (!result){
                logger.info('Record not found.');
                dnsCache.resolveDns(domain, type, function(error){
                        logger.debug('Error =>'+JSON.stringify(error));
                    },
                    function(answer){
                        response.authority = answer.authority;
                        response.answer = answer.answer;

                        try {
                            response.send();
                            unitOfWork.inMemory.push(domain, type, answer);
                        }catch(ex){
                            logger.debug('Domain: '+domain+', type: '+type+', exception: '+ex);
                        }
                    });
            } else {
                console.log('Sending from memory');
                response.authority = result.authority;
                response.answer = result.answer;
                response.send();
                console.log('Send is finished');
            }

            logger.info('Database size: '+unitOfWork.inMemory.getCacheSize());
        });
    });

    server.onError(function(error, stack){
        logger.warn('Error: '+error+' => stack: '+stack);
    });

    server.start(config.DNS_PORT | 53);
});