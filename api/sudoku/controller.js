const { Errors } = require('../../constants/Errors')
const ServerError = require('../../utils/ServerError')
const service = require('./service')


const getSudokuFromImage = async (req, res, next) => {
  try {
    const { newFileName } = req.file
    await service.getSudokuFromImage(newFileName, res)
  } catch (error) {
    next(error)
  }
}

const getRandomSudoku = async (req, res, next) => {
  try {
    const difficulty = req.query.difficulty || 0
    if (difficulty < 0 || difficulty > 3) {
      const errorMessage = `difficulty need to be between 0 - 3, not ${difficulty}`
      throw new ServerError(Errors.SUDOKU({ code: 412, errorMessage }))
    }
    await service.getRandomSudoku(Number(difficulty), res)
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
