import { createLogger, format, transports } from 'winston'
const { combine, timestamp, label, printf } = format

const isProd = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'

const TECH_LABEL = 'tech'
const APP_LABEL = 'app'

const options = {
  console: {
    level: isProd ? 'info' : isTest ? 'warn' : 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
}

const logJsonFormat = printf(({ label, level, message, timestamp }) =>
  JSON.stringify({
    level,
    label,
    timestamp,
    message,
  })
)

const logFormat = printf(({ level, message }) => `${level} ${message}`)

export const simpleLogger = createLogger({
  format: logFormat,
  transports: [new transports.Console(options.console)],
  exitOnError: false,
})

export const techLogger = createLogger({
  format: combine(
    label({ label: TECH_LABEL }),
    timestamp(),
    isTest ? logFormat : logJsonFormat
  ),
  transports: [new transports.Console(options.console)],
  exitOnError: false,
})

export const appLogger = createLogger({
  format: combine(
    label({ label: APP_LABEL }),
    timestamp(),
    isTest ? logFormat : logJsonFormat
  ),
  transports: [new transports.Console(options.console)],
  exitOnError: false,
})

export const loggerStream = {
  write (message, encoding) {
    appLogger.info(message)
  },
}
