const winston = require('winston');
const config = require('config');
require('winston-mongodb')

module.exports = function () {
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File(
      {
        filename: 'uncaugthExceptions.log',
        level: 'info'
      }));

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });

  new winston.transports.File({ filename: 'logfile.log' });
  new winston.transports.MongoDB({
    db: config.get('db'),
    level: 'info'
  });
}
