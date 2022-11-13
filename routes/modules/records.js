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
  req.body.userId = userId
  return Record.create(req.body)
    .then(() => {
      res.redirect('/')
    })
    .catch((err) => console.log(err))
})

// edit
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  const userId = req.user.id
  return Record.findOne({ id, userId })
    .lean()
    .then((records) => res.render('edit', { records }))
    .catch((err) => console.log(err))
})

// update 
router.put('/:id/edit', (req, res) => {
  const id = req.params.id
  const userId = req.user.id
  const { name, date, categoryId, amount } = req.body
  return Record.findOne({ id, userId })
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
router.delete('records/:id/delete', (req, res) => {
  const id = req.params.id
  const userId = req.user.id
  return Record.findOne({ id, userId })
    .then((records) => records.remove())
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err))
})

module.exports = router