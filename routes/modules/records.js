const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const moment = require('moment')

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
router.get('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  return Record.findOne({ _id, userId })
    .lean()
    .then(records => {
      records.date = moment(records.date).format('YYYY-MM-DD')
      Category.find({})
        .sort({ id: 'asc' })
        .lean()
        .then(categories => {
          categories.forEach(category => {
            if (records.categoryId == category.id) {
              category.selected = 'selected'
              categoryData.push(category)
            } else {
              categoryData.push(category)
            }
          })
          res.render('edit', { records, categoryData })
        })
    })
    .catch((err) => console.log(err))
})

// update 
router.put('/:id', (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  const { name, date, categoryId, amount } = req.body

  return Record.findOne({ _id, userId, })
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