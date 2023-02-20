const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const errorController = require('./controller/error')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')

const app = express()

dotenv.config()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(errorController.get404)

mongoose
  .connect(
    `mongodb+srv://tidgomes:${process.env.DB_PASSWORD}@cluster0.gomczzm.mongodb.net/shop?retryWrites=true&w=majority`
  )
  .then(result => {
    console.log('Connected to the database')
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })
