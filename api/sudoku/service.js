const Sudoku = require('../../models/Sudoku')
const logger = require('../../utils/Logger')

const getSudokuFromImage = async (fileName, res) => {
  console.log({ fileName })
  const sudoku = new Sudoku()
  sudoku.getRandomBoard(0)
  return res.status(200).send({ board: sudoku.board })
}

const getRandomSudoku = async (difficulty, res) => {
  const sudoku = new Sudoku()
  sudoku.getRandomBoard(difficulty)
  return res.status(200).send({ board: sudoku.board })
}
const checkSudokuSolution = async (board, res) => {
  const sudoku = new Sudoku(board)
  return res.status(200).send({ solved: sudoku.checkIfSolved() })
}
const solveSudoku = async (board, res) => {
  const sudoku = new Sudoku(board)
  console.time('board - solution')
  if (sudoku.solveBoard()) {
    logger.info('board been solved!!!')
    res.status(200).send({ board: sudoku.board })
  } else {
    logger.warn('Failed to solved board')
    res.status(500).send({ message: 'Failed to solved board' })
  }
  console.timeEnd('board - solution')
}

module.exports = {
  getSudokuFromImage,
  getRandomSudoku,
  checkSudokuSolution,
  solveSudoku,
}
