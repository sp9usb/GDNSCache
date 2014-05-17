/**
 * Created by Kamil on 2014-05-17.
 */

module.exports = exports = function(){
  var winston = require('winston');

  var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)({ json: false, timestamp: true }),
      new winston.transports.File({ filename: __dirname + '/debug.log', json: false })
    ],
    exceptionHandlers: [
      new (winston.transports.Console)({ json: false, timestamp: true }),
      new winston.transports.File({ filename: __dirname + '/exceptions.log', json: false })
    ],
    exitOnError: false
  });

  return logger;
};
