import { Meteor } from 'meteor/meteor';
import winston from 'winston';

const debug = true;

let logger;

if (Meteor.isServer) {
  let level = 'silly';
  if (Meteor.isTest) {
    level = 'debug';
  }
  logger = winston.createLogger({
    level,
    // levels: winston.config.npm,
    transports: [
      new winston.transports.Console({
        format: winston.format.simple(),
        timestamp: true,
      }),
    ],
  });
} else {
  if (debug) {
    logger = console;
  } else {
    logger = {
      info: () => {},
      debug: () => {},
      warn: () => {},
      log: () => {},
    };
  }
}

export { logger };
export default logger;
