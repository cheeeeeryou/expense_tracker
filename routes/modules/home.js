const express = require('express')
const router = express.Router()
const Record = require('../../models/record')

router.get('/', (req, res) => {
  const userId = req.user._id
  Record.find({ userId })
    .lean()
    .sort({ _id: 'desc' })
    .then(records => res.render('index', { records }))
    .catch(error => console.error(error))
})

router.get('/records/new', (req, res) => {
  return res.render('new')
})

router.get('/', (req, res) => {
  const userId = req.user._id
  return Record.find({ userId })
    .lean()
    .sort({ date: 'desc' })
    .then((records) => {
      let total = 0
      for (let i = 0; i < records.length; i++) {
        total += records[i].amount
      }
      res.render('index', { records, total })
    })
    .catch((err) => console.log(err))
})


module.exports = router