const express = require('express')
const router = express.Router()
const Record = require('../../models/record')

// edit 
router.get('/new', (req, res) => {
  res.render('new')
})

// add
router.post('/', (req, res) => {
  const userId = req.user._id
  //add userId to each record
  req.body.userId = userId
  return Record.create(req.body)
    .then(() => {
      res.redirect('/')
    })
    .catch((err) => console.log(err))
})

// edit
router.get('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  return Record.findOne({ _id, userId })
    .lean()
    .then((records) => res.render('edit', { records }))
    .catch((err) => console.log(err))
})

// update 
router.put('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  const { name, date, categoryId, amount } = req.body
  return Record.findOne({ _id, userId })
    .then((records) => {
      records.name = name
      records.date = date
      records.categoryId = Number(categoryId)
      records.amount = amount
      return records.save()
    })
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err))
})

// delete 
router.delete('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  return Record.findOne({ _id, userId })
    .then((records) => records.remove())
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err))
})

module.exports = router