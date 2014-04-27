module.exports = exports = function(){
  var inMemory = require('./data/DataContext/InMemoryContext')();

  return {
    inMemory: inMemory
  };
};