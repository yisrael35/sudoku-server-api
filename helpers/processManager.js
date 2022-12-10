const ServerError = require('../utils/ServerError')
const { Errors } = require('../constants/Errors')
const { isNumber, isString, isArray } = require('lodash')

const checkForRequiredFields = ({ items, payload }) => {
  if (!payload) {
    return false
  }
  for (const item of items) {
    if (payload[item] === undefined) {
      return false
    }
  }
  return true
}

const processExample = (payload) => {
  const items = ['board']
  if (!checkForRequiredFields({ items, payload })) {
    const errorMessage = `Missing fields, required fields: (${items})`
    throw new ServerError(Errors.PROCESS_ERROR({ errorMessage, code: 412 }))
  }
  const processed_payload = {}

  for (const [key, val] of Object.entries(payload)) {
    if (val !== undefined) {
      switch (key) {
        case 'board':
          if (!isArray(val)) {
            const errorMessage = `'${key}' property should be array, not ${typeof val}`
            throw new ServerError(Errors.PROCESS_ERROR({ errorMessage, code: 412 }))
          }
          for (const row of val) {
            if (!isArray(row)) {
              const errorMessage = `'${key}' property should be array of arrays, not ${typeof row}`
              throw new ServerError(Errors.PROCESS_ERROR({ errorMessage, code: 412 }))
            }
            if (!row.every((value) => isNumber(value) && value >= 0)) {
              const errorMessage = `'${key}' property should be array of arrays with only positive number in it, not ${row}`
              throw new ServerError(Errors.PROCESS_ERROR({ errorMessage, code: 412 }))
            }
          }

          processed_payload.board = val
          break
        default:
          const errorMessage = `'${key}' property is not allowed in the request!`
          throw new ServerError(Errors.PROCESS_ERROR({ errorMessage, code: 412 }))
      }
    }
  }

  return processed_payload
}

module.exports = {
  processExample,
  checkForRequiredFields,
}
