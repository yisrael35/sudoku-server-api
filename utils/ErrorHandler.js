const logger = require('./Logger')

const errorHandler = (err, req, res, next) => {
  const { code, message, systemMessage, stack } = err

  if (code) {
    logger.warn(`[${code}] message: ${message}, systemMessage: ${systemMessage}, stack: ${stack}`)
  } else {
    logger.error(`UNEXPECTED ERROR message: ${message}, systemMessage: ${systemMessage}, stack: ${stack}`)
  }

  res.status(code).send({ message })
}

module.exports = errorHandler
