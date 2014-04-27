module.exports = exports = function(){
  var dnsResults = [];

  function push(domain, type, ip){
    dnsResults.push({
      domain: domain,
      type: type,
      value: ip
    });
  };

  function get(domain, type){
    var res = dnsResults.filter(function(item){
      return item.domain === domain && item.type === type;
    });
    console.log('Result => '+JSON.stringify(res));
    if(res !== null && res !== undefined && res.length > 0){
      return res.map(function(address){
        address.value;
      });
    }
    return null;
  };

  return {
    push: push,
    get: get
  };
};