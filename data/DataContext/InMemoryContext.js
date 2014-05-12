module.exports = exports = function(config){
  var dnsResults = [];
  var config = config;

  function push(domain, type, answer){
    var theDnsRecord = {
      domain: domain,
      type: type,
      answer: answer
    };
    dnsResults.push(theDnsRecord);
    setTimeout(function(){
      var indexOfDnsRecordToRemove = dnsResults.indexOf(theDnsRecord);
      dnsResults.splice(indexOfDnsRecordToRemove, 1);
      console.log('Removed old record '+theDnsRecord.domain);
    }, config.TIME_TO_REMOVE_RECORD_FROM_CACHE*1000);
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