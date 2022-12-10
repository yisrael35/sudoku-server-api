const Sudoku = require('../../models/Sudoku')
const logger = require('../../utils/Logger')

const getSudokuFromImage = async (res) => {
  return res.status(200).send({})
}

const getRandomSudoku = async (res) => {
  const sudoku = new Sudoku()
  sudoku.getRandomBoard()
  // sudoku.printBoard()
  return res.status(200).send({ board: sudoku.getRandomBoard() })
}
const checkSudokuSolution = async (board, res) => {
  const sudoku = new Sudoku(board)
  // sudoku.printBoard()
  return res.status(200).send({ solved: sudoku.checkIfSolved() })
}
const solveSudoku = async (board, res) => {
  const sudoku = new Sudoku(board)
  console.time('board - solution')
  sudoku.solveBoard()
  if ( sudoku.solveBoard()) {
    logger.info('board been solved!!!')
  } else {
    logger.warn('Failed to solved board')
  }
  sudoku.printBoard()
  console.timeEnd('board - solution')
  return res.status(200).send({ board: sudoku.board })
}

module.exports = {
  getSudokuFromImage,
  getRandomSudoku,
  checkSudokuSolution,
  solveSudoku,
}
