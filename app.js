// app.js
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Record = require('./models/record')
const category = require('./models/category')


// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true
}) // 設定連線到 mongoDB
// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})
app.use(bodyParser.urlencoded({ extended: true }))
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// 設定首頁路由
app.get('/', (req, res) => {
  Record.find()
    .lean()
    .sort({ _id: 'desc' })
    .then(records => res.render('index', { records }))
    .catch(error => console.error(error))
})

app.get('/records/new', (req, res) => {
  return res.render('new')
})

app.post('/records', (req, res) => {
  const name = req.body.name
  const date = req.body.date
  const categoryId = Number(req.body.categoryId)
  const amount = req.body.amount       // 從 req.body 拿出表單裡的資料
  return Record.create({ name, date, categoryId, amount })     // 存入資料庫
    .then(() => res.redirect('/')) // 新增完成後導回首頁
    .catch(error => console.log(error))
})

// edit func.
app.get('/records/:id/edit', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .lean()
    .then((record) => res.render('edit', { record }))
    .catch(error => console.log(error))
})

app.post('/records/:id/edit', (req, res) => {
  const id = req.params.id
  const { name, date, categoryId, amount } = req.body
  return Record.findById(id)
    .then(records => {
      records.name = name
      records.date = date
      records.categoryId = Number(categoryId)
      records.amount = amount
      return records.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

//delete
app.post('/records/:id/delete', (req, res) => {
  const id = req.params.id
  return Record.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

app.get('/', (req, res) => {
  return Record.find()
    .lean()
    .sort({ date: 'desc' })
    .then((records) => {
      let totalAmount = 0
      for (let i = 0; i < records.length; i++) {
        totalAmount += records[i].amount
      }
      return res.render('index', { totalAmount })
    })
    .catch((err) => console.log(err))
})


//total
app.get('/category', (req, res) => {
  const categoryId = Number(req.query.categoryId)
  if (categoryId === 6) {
    return Record.find()
      .lean()
      .sort({ date: 'desc' })
      .then((records) => {
        let totalSelect = 0
        for (let i = 0; i < records.length; i++) {
          totalSelect += records[i].amount
        }
        return res.render('category', { records, totalSelect })
      })
      .catch((err) => console.log(err))
  }
  return Record.find({ categoryId })
    .lean()
    .sort({ date: 'desc' })
    .then((records) => {
      let totalSelect = 0
      for (let i = 0; i < records.length; i++) {
        totalSelect += records[i].amount
      }
      res.render('category', { records, totalSelect })
    })
    .catch((err) => console.log(err))
})






// 設定 port 3000
app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})