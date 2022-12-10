const Errors = {
  PROCESS: ({ code, errorMessage, systemMessage }) => ({ code: code || 412, message: errorMessage, systemMessage: systemMessage }),
  GENERAL: ({ code, systemMessage }) => ({ code: code || 500, message: 'Internal Error', systemMessage: systemMessage }),
  SUDOKU: ({ code, errorMessage, systemMessage }) => ({ code: code || 500, message: errorMessage || 'Internal Error', systemMessage: systemMessage }),
}

module.exports = {
  Errors,
}
