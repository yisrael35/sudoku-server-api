const { isEqual, sortBy } = require('lodash')
const ServerError = require('../utils/ServerError')
const { Errors } = require('../constants/Errors')
const logger = require('../utils/Logger')

const defaultSize = 9
class Sudoku {
  constructor(board) {
    this.counter = 0
    if (board) {
      this.#checkIfBoardIsValid(board)
      this.board = board
      this.size = defaultSize
      this.#hintNotValid()
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
      const errorMessage = `Board is not valid, should be 9 rows not: ${board.length}`
      throw new ServerError(Errors.SUDOKU({ code: 412, errorMessage }))
    }

    for (const row of board) {
      if (row.length !== defaultSize) {
        const errorMessage = `Board is not valid, should be 9 cols, but supplied ${JSON.stringify(row)}`
        throw new ServerError(Errors.SUDOKU({ code: 412, errorMessage }))
      }
      if (!row.every((val) => val >= 0 && val < 10)) {
        const errorMessage = `Board is not valid, all numbers should be between 0 - 9`
        throw new ServerError(Errors.SUDOKU({ code: 412, errorMessage }))
      }
    }
    return true
  }

  #fillRandomNumbers() {
    const numAmountToFill = 20
    const maxNumOfTries = 1000
    let numOfTries = 0

    // Add some initial numbers to the grid
    for (let i = 0; i < numAmountToFill; i++) {
      let x = Math.floor(Math.random() * this.size)
      let y = Math.floor(Math.random() * this.size)
      while (this.board[x][y] === 0 && numOfTries < maxNumOfTries) {
        this.board[x][y] = Math.floor(Math.random() * this.size) + 1
        if (!this.checkIfValid()) {
          this.board[x][y] = 0
        }
        numOfTries++
      }
    }
  }

  getRandomBoard(difficulty = 0) {
    // 3 = easy, 2 = medium, 1 = hard, 0 = expert

    const maxNumOfTries = 1000
    let numOfTries = 0
    do {
      this.#fillRandomNumbers()
      numOfTries++
    } while (!this.checkIfValid() && numOfTries < maxNumOfTries)
    if (numOfTries === maxNumOfTries) {
      const errorMessage = `Failed to generate a random board - please try again`
      throw new ServerError(Errors.SUDOKU({ code: 500, errorMessage }))
    }

    if (this.solveBoard()) {
      // Remove numbers based on the difficulty level
      const numToRemove = 55 - (difficulty + 1) * 10
      for (let i = 0; i < numToRemove; i++) {
        let x = Math.floor(Math.random() * this.size)
        let y = Math.floor(Math.random() * this.size)
        while (this.board[x][y] === 0) {
          x = Math.floor(Math.random() * this.size)
          y = Math.floor(Math.random() * this.size)
        }
        this.board[x][y] = 0
      }
    } else {
      const errorMessage = `Failed to find a solution to the generated board - please try again`
      throw new ServerError(Errors.SUDOKU({ code: 500, errorMessage }))
    }

    return this.board
  }

  printBoard() {
    for (const row of this.board) {
      logger.info(JSON.stringify(row))
    }
  }

  checkIfSolved() {
    if (this.#checkRowsForWin() && this.#checkColsForWin() && this.#checkBoxesForWin()) {
      return true
    }
    return false
  }

  checkIfValid() {
    //check if there is no double values in a row
    for (const row of this.board) {
      if (!this.#checkForDoubleValues(row)) {
        return false
      }
    }

    //check if there is no double values in a col
    for (let i = 0; i < this.board.length; i++) {
      const col = this.board.map((val) => val[i])
      if (!this.#checkForDoubleValues(col)) {
        return false
      }
    }

    //check if there is no double values in a box
    for (let i = 0; i < this.board.length; i++) {
      const box = this.#getBox(i)
      if (!this.#checkForDoubleValues(box)) {
        return false
      }
    }
    return true
  }

  #checkForDoubleValues(array) {
    const sortedArray = sortBy(array)
    for (let i = 1; i < sortedArray.length; i++) {
      if (sortedArray[i] === 0) {
        continue
      } else if (sortedArray[i - 1] === sortedArray[i]) {
        return false
      }
    }
    return true
  }

  #checkRowsForWin() {
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

  #checkColsForWin() {
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

  #checkBoxesForWin() {
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
    this.optimalAlgo()
    return this.#solveBoardHelper()
  }

  #solveBoardHelper() {
    this.counter++
    if (this.counter >= 50_000) {
      const errorMessage = `Failed to solved board - too many iteration, ${this.counter}`
      throw new ServerError(Errors.SUDOKU({ code: 500, errorMessage }))
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
    for (let index = 0; index < rangeArray.length; index++) {
      rangeArray[index] = index + 1
    }
    const row = this.board[i]
    const col = this.board.map((val) => val[j])
    const box = []
    const square = Math.sqrt(this.size)

    let k1 = Math.floor(i / square) * square
    let m1 = Math.floor(j / square) * square

    for (let k = k1; k < k1 + square; k++) {
      for (let m = m1; m < m1 + square; m++) {
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

  optimalAlgo() {
    let foundOptions = false
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[i][j] !== 0) {
          continue
        }
        const options = this.#getOptions(i, j)
        if (options.length !== 1) {
          continue
        }
        foundOptions = true
        this.board[i][j] = options[0]
      }
    }
    if (foundOptions === true) {
      this.optimalAlgo()
    }
    return
  }

  #hintNotValid() {
    for (const row of this.board) {
      if (!this.#checkForDoubleValues(row)) {
        const errorMessage = `Board is not valid, Row has double values: ${JSON.stringify(row)}`
        throw new ServerError(Errors.SUDOKU({ code: 412, errorMessage }))
      }
    }

    //check if there is no double values in a col
    for (let i = 0; i < this.board.length; i++) {
      const col = this.board.map((val) => val[i])
      if (!this.#checkForDoubleValues(col)) {
        const errorMessage = `Board is not valid, Col num: ${i + 1} has double values: ${JSON.stringify(col)}`
        throw new ServerError(Errors.SUDOKU({ code: 412, errorMessage }))
      }
    }

    //check if there is no double values in a box
    for (let i = 0; i < this.board.length; i++) {
      const box = this.#getBox(i)
      if (!this.#checkForDoubleValues(box)) {
        const errorMessage = `Board is not valid, Box num: ${i + 1} has double values: ${JSON.stringify(box)}`
        throw new ServerError(Errors.SUDOKU({ code: 412, errorMessage }))
      }
    }
  }

}

module.exports = Sudoku
