require('dotenv').config()
const express = require('express')
const cors = require('cors')
const server = express()
server.use(express.json())
const errorHandler = require('./utils/ErrorHandler')
const logger = require('./utils/Logger')



server.use(cors('*'))
server.use('/assets', express.static('files/uploads'))
// Files of the Routes
const sudoku_routes = require('./api/sudoku/routes')

// Routes
server.use('/sudoku', sudoku_routes)
server.use(errorHandler)


const port = process.env.HTTP_PORT || 3002
server.listen(port, () => {
  logger.info(`[SERVER] Sudoku HTTP Server is running on port: ${port}`)
})