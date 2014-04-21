var dns = require('native-dns');
var server = dns.createServer();

var unitOfWork = {
  inMemory: {
    dnsResults: [],
    push: function(domain, type, ip){
      unitOfWork.inMemory.dnsResults.push({
        domain: domain,
        type: type,
        value: ip
      });
    },
    get: function(domain, type){
      var res = unitOfWork.inMemory.dnsResults.filter(function(item){
        return item.domain === domain && item.type === type;
      });
      console.log('Result => '+JSON.stringify(res));
      if(res !== null && res !== undefined && res.length > 0){
        return res.map(function(address){
          address.value;
        });
      }
      return null;
    }
  }
};

function mapTypeValueToTypeKey(typeValue){
  var keys = Object.keys(dns.consts.NAME_TO_QTYPE);
  var res = keys.filter(function(key){
    return dns.consts.NAME_TO_QTYPE[key] === typeValue;
  });
  if (res){
    return res[0];
  }
  throw 'Invalid DNS TYPE value';
};

function resolveDns(domain, typeValue, err, res){
  var type = mapTypeValueToTypeKey(typeValue);
  var question = dns.Question({
    name: domain,
    type: type
  });

  console.log(question);

  var req = dns.Request({
    question: question,
    server: {
      address: '8.8.8.8',
      port: 53,
      type: 'udp'
    },
    timeout: 1000
  });

  req.on('timeout', function(){
    err('timeout');
  });

  req.on('message', function(error, answer){
    if (error){
      err(error);
    }
    var addresses = answer.answer.map(function(a){
      return a.address;
    });
    res(addresses);
  });

  req.send();
};

function createDnsRecord(domain, address, type){

  function createARecord(domain, address){
    return dns.A({
      name: request.question[0].name,
      address: address,
      ttl: 600,
    });
  };
  function createAAAARecord(domain, address){
    return dns.AAAA({
      name: request.question[0].name,
      address: address,
      ttl: 600,
    });
  };
  function createMXRecord(domain, address){
    return dns.MX({
      name: request.question[0].name,
      address: address,
      ttl: 600,
    });
  };
  function createNSRecord(domain, address){
    return dns.NS({
      name: request.question[0].name,
      address: address,
      ttl: 600,
    });
  };

  if (type === mapTypeValueToTypeKey('A')){
    return createARecord(domain, address);
  } else if (type === mapTypeValueToTypeKey('AAAA')){
    return createAAAARecord(domain, address);
  } else if (type === mapTypeValueToTypeKey('MX')){
    return createMXRecord(domain, address);
  } else if (type === mapTypeValueToTypeKey('NS')){
    return createNSRecord(domain, address);
  }

};

server.on('request', function (request, response) {

  request.question.forEach(function(question){
    console.log(question);
    var domain = question.name;
    var type = question.type;

    var result = unitOfWork.inMemory.get(domain, type);
    if (!result){
      console.log('Record not found.');
      resolveDns(domain, type, function(error){
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

server.on('error', function (err, buff, req, res) {
  console.log(err.stack);
});

server.serve(53);