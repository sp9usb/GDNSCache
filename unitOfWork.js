module.exports = exports = function(config){
  var inMemory = require('./data/DataContext/InMemoryContext')(config);

  return {
    inMemory: inMemory
  };
};