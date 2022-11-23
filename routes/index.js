const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const records = require('./modules/records')
const category = require('./modules/category')
const users = require('./modules/users')
const { authenticator } = require('../middleware/auth')


router.use('/records', authenticator, records)
router.use('/category', category)
router.use('/users', users)
router.use('/', authenticator, home)

router.get('/', (req, res) => {
  const userId = req.user._id
  return Record.find({ userId })
    .lean()
    .sort({ date: 'desc' })
    .then((records) => {
      let totalAmount = 0
      for (let i = 0; i < records.length; i++) {
        totalAmount += records[i].amount
      }
      console.log('records is:', records)
      return res.render('index', { records, totalAmount })
    })
    .catch((err) => console.log(err))
})


module.exports = router