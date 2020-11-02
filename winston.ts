//Winston Import
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

import {
  LOG_NAME,
  LOG_PATH,
  LOG_LEVEL,
} from './environment/constants.ts';

export const LogConfig = {
  logName: LOG_NAME,
  logDirectory: LOG_PATH,
  logFileWarning: 'warnings-%DATE%.log',
  logFileIssue: 'errors-%DATE%.log',
  logDatePattern: 'YYYY-MM-DD',
  logLevel: LOG_LEVEL,
  consoleLogLevel: CONSOLE_LOG_LEVEL,
};

// Define custom format for logs
const customFormat = winston.format.combine(
  winston.format.splat(),
  winston.format.simple(),
  winston.format.align(),
  winston.format.colorize(),
  winston.format.printf(
    info =>
      `${moment().format('YYYY-MM-DD HH:mm:ss:SS')} - ${info.level} : ${
        info.message
      }`,
  ),
);

// Add loggers to the app...
winston.loggers.add(LogConfig.logName, {
  exitOnError: false,
  format: winston.format.combine(customFormat),
  transports: [
    new DailyRotateFile({
      filename: LogConfig.logDirectory + LogConfig.logFileWarning,
      datePattern: LogConfig.logDatePattern,
      zippedArchive: true,
      level: LogConfig.logLevel,
    }),
    new DailyRotateFile({
      filename: LogConfig.logDirectory + LogConfig.logFileIssue,
      datePattern: LogConfig.logDatePattern,
      zippedArchive: true,
      level: 'error',
    }),
    // Set to None to prevent logging in the console
    new winston.transports.Console({
      level: LogConfig.consoleLogLevel,
    }),
  ],
});
