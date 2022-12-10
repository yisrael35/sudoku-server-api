const service = require('./service')

const getSudokuFromImage = async (req, res, next) => {
  try {
    await service.getSudokuFromImage(res)
  } catch (error) {
    next(error)
  }
}
const getRandomSudoku = async (req, res, next) => {
  try {
    await service.getRandomSudoku(res)
  } catch (error) {
    next(error)
  }
}
const checkSudokuSolution = async (req, res, next) => {
  try {
    const { board } = req.body
    await service.checkSudokuSolution(board, res)
  } catch (error) {
    next(error)
  }
}
const solveSudoku = async (req, res, next) => {
  try {
    const { board } = req.body
    await service.solveSudoku(board, res)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getSudokuFromImage,
  getRandomSudoku,
  checkSudokuSolution,
  solveSudoku,
}
