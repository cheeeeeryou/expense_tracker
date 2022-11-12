const mongoose = require('mongoose')
const Schema = mongoose.Schema
const recordSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    require: true
  },
  categoryId: {
    type: Number,
    ref: 'Category',
    index: true,
    require: true
  },
  amount: {
    type: Number,
    require: true
  },
})
module.exports = mongoose.model('Record', recordSchema)