module.exports = exports = function(){
  var dnsResults = [];

  function push(domain, type, answer){
    dnsResults.push({
      domain: domain,
      type: type,
      answer: answer
    });
  };

  function get(domain, type){
    var res = dnsResults.filter(function(item){
      return item.domain === domain && item.type === type;
    });
    if(res !== null && res !== undefined && res.length > 0){
      return res[0].answer;
    }
    return null;
  };

  return {
    push: push,
    get: get,
    getCacheSize: function(){
      return dnsResults.length;
    }
  };
};