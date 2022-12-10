const { isEqual, sortBy } = require('lodash')
const ServerError = require('../utils/ServerError')
const { Errors } = require('../constants/Errors')
const logger = require('../utils/Logger')

const defaultSize = 9
class Sudoku {
  constructor(board) {
    this.counter = 0
    if (board) {
      if (!this.#checkIfBoardIsValid(board)) {
        const errorMessage = `supplied board is not valid`
        throw new ServerError(Errors.SUDOKU({ code: 400, errorMessage }))
      }
      this.board = board
      this.size = defaultSize
      return
    }
    const emptyBoard = new Array(defaultSize)
    for (let i = 0; i < emptyBoard.length; i++) {
      emptyBoard[i] = new Array(defaultSize).fill(0)
    }

    this.board = emptyBoard
    this.size = defaultSize
  }

  #checkIfBoardIsValid(board) {
    if (board.length !== defaultSize) {
      return false
    }

    for (const row of board) {
      if (row.length !== defaultSize) {
        return false
      }
      if (!row.every((val) => val >= 0 || val < 10)) {
        return false
      }
    }
    return true
  }

  getRandomBoard() {
    //TODO -- NEED TO DO A REAL GENERATOR
    this.board = [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [3, 4, 5, 2, 8, 0, 0, 7, 9],
    ]
    return this.board
  }

  printBoard() {
    for (const row of this.board) {
      logger.info(JSON.stringify(row))
    }
  }

  checkIfSolved() {
    if (this.#checkRows() && this.#checkCols() && this.#checkBoxes()) {
      return true
    }
    return false
  }

  #checkRows() {
    const rangeArray = new Array(this.size)
    for (let i = 0; i < rangeArray.length; i++) {
      rangeArray[i] = i + 1
    }
    for (const row of this.board) {
      if (!isEqual(sortBy(row), rangeArray)) {
        return false
      }
    }
    return true
  }

  #checkCols() {
    const rangeArray = new Array(this.size)
    for (let i = 0; i < rangeArray.length; i++) {
      rangeArray[i] = i + 1
    }

    for (let i = 0; i < this.board.length; i++) {
      const col = this.board.map((val) => val[i])
      if (!isEqual(sortBy(col), rangeArray)) {
        return false
      }
    }
    return true
  }

  #checkBoxes() {
    const rangeArray = new Array(this.size)
    for (let i = 0; i < rangeArray.length; i++) {
      rangeArray[i] = i + 1
    }

    for (let i = 0; i < this.board.length; i++) {
      const box = this.#getBox(i)
      if (!isEqual(sortBy(box), rangeArray)) {
        return false
      }
    }

    return true
  }

  #getBox(i) {
    const boxArray = []
    const square = Math.sqrt(this.size)
    const boxRow = parseInt(i / square)
    let boxCol
    //TODO find a better way to get box column
    if (i % square === 0) {
      boxCol = 0
    }
    if ((i - 1) % square === 0) {
      boxCol = 1
    }
    if ((i - 2) % square === 0) {
      boxCol = 2
    }

    const row = square * boxRow
    const col = square * boxCol
    for (let i = row; i < row + square; i++) {
      for (let j = col; j < col + square; j++) {
        boxArray.push(this.board[i][j])
      }
    }
    return boxArray
  }

  solveBoard() {
    return this.#solveBoardHelper()
  }

  #solveBoardHelper() {
    this.counter++
    if (this.counter >= Number.MAX_SAFE_INTEGER - 2) {
      logger.warn('Failed to solved board - too many iteration')
      return false
    }

    if (this.#boardIsFull()) {
      return this.checkIfSolved()
    }
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[i][j] === 0) {
          const options = this.#getOptions(i, j)
          if (options.length === 0) {
            return false
          }
          for (let k = 0; k < options.length; k++) {
            this.board[i][j] = options[k]
            if (this.#solveBoardHelper()) {
              return true
            } else {
              this.board[i][j] = 0
            }
          }
          if (this.board[i][j] === 0) {
            return false
          }
        }
      }
    }
    return this.checkIfSolved()
  }

  #boardIsFull() {
    return this.board.every((row) => row.every((val) => val > 0))
  }

  #getOptions(i, j) {
    const rangeArray = new Array(this.size)
    for (let i = 0; i < rangeArray.length; i++) {
      rangeArray[i] = i + 1
    }
    const row = this.board[i]
    const col = this.board.map((val) => val[j])
    const box = []
    const square = Math.sqrt(this.size)

    for (let k; k < i + square; k++) {
      for (let m; m < j + square; m++) {
        box.push(this.board[k][m])
      }
    }

    const optionsArray = []
    for (const val of rangeArray) {
      if (!row.includes(val) && !col.includes(val) && !box.includes(val)) {
        optionsArray.push(val)
      }
    }

    return optionsArray
  }
}

module.exports = Sudoku
