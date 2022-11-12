const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moneySchema = new Schema({
  name: {
    type: String, // 資料型別是字串
    required: true // 這是個必填欄位
  },
  date: {
    type: Date,
    required: true,
  },
  categoryID: {
    type: Number,
    ref: 'Categoty',
    index: true,
    require: true
  },
  amount: {
    type: Number,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    require: true
  }
})
module.exports = mongoose.model('Record', todoSchema)