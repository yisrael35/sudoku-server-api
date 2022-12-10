const logger = require('./Logger')

const errorHandler = (err, req, res, next) => {
  const { code, message, systemMessage, stack } = err

  if (code) {
    logger.warn(`[${code}] message: ${message}, stack: ${stack}`)
  } else {
    logger.error(`UNEXPECTED ERROR message: ${message}, systemMessage: ${systemMessage}, stack: ${stack}`)
  }

  res.status(code).send({ message })
  logger.warn(`${systemMessage || message} stack: ${stack}`)
}

module.exports = errorHandler
