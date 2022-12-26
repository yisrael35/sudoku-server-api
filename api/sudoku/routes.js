const express = require('express')
const multer = require('multer')
const { Errors } = require('../../constants/Errors')
const ServerError = require('../../utils/ServerError')
const { getSudokuFromImage, getRandomSudoku, checkSudokuSolution, solveSudoku } = require('./controller')
const upload = multer({ dest: './files/uploads' }).single('file')
const fs = require('fs')
const path = require('path')
const router = express.Router()

const wrapUpload = (req, res, next) => {
  upload(req, res, (err) => {
    try {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        const errorMessage = `Error occurred when uploading`
        throw new ServerError(Errors.SUDOKU({ code: 400, errorMessage }))
      } else if (err) {
        // An unknown error occurred when uploading.
        const errorMessage = `An unknown error occurred when uploading`
        throw new ServerError(Errors.SUDOKU({ code: 500, errorMessage }))
      }
      // Everything went fine.
      // rename file
      const { originalname, destination, path: fileSrc } = req.file
      const extension = originalname.split('.')[1]
      const newFileName = `${Date.now()}.${extension}`
      req.file.newFileName = newFileName
      const fileDest = path.join(destination, newFileName)
      fs.renameSync(fileSrc, fileDest)

      next()
    } catch (error) {
      next(error)
    }
  })
}

router.post('/image/', wrapUpload, getSudokuFromImage)
router.get('/random', getRandomSudoku)
router.post('/solved', checkSudokuSolution)
router.post('/solve', solveSudoku)

module.exports = router
