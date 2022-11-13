if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const Category = require('../category')
const mongoose = require('mongoose')
const db = mongoose.connection

const categoryData = [
  { id: 1, name: '飲食' },
  { id: 2, name: '交通' },
  { id: 3, name: '娛樂' },
  { id: 4, name: '日用品' },
  { id: 5, name: '其他' }
]

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  return Promise.all(
    categoryData.map((category) => {
      return Category.create(category)
    })
  )
    .then(() => {
      console.log('Category seeder is done.')
      process.exit()
    })
    .catch((error) => console.log(error))
})