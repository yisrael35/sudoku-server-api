const express = require('express')
const { getSudokuFromImage, getRandomSudoku, checkSudokuSolution, solveSudoku } = require('./controller')

const router = express.Router()

router.get('/image/:filename', getSudokuFromImage)
router.get('/random', getRandomSudoku)
router.post('/solved', checkSudokuSolution)
router.post('/solve', solveSudoku)

module.exports = router
