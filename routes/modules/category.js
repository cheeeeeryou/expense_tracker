const express = require('express')
const router = express.Router()
const Record = require('../../models/record')


router.get('/', (req, res) => {
  const categoryId = Number(req.query.categoryId)
  const userId = req.user._id
  if (Number(categoryId) === 6) {
    return Record.find({ userId })
      .lean()
      .sort({ date: 'desc' })
      .then((records) => {
        let total = 0
        for (let i = 0; i < records.length; i++) {
          total += records[i].amount
        }
        return res.render('index', { records, total, categoryId })
      })
      .catch((err) => console.log(err))
  }

  return Record.find({ categoryId, userId })
    .lean()
    .sort({ date: 'desc' })
    .then((records) => {
      let total = 0
      for (let i = 0; i < records.length; i++) {
        total += records[i].amount
      }
      return res.render('index', { records, total, categoryId })
    })
    .catch((err) => console.log(err))
})

module.exports = router