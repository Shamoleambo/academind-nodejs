const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const errorController = require('./controller/error')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const User = require('./models/user')

const app = express()

dotenv.config()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use((req, res, next) => {
  User.findById('63f3874cca9d5f7f39325d66')
    .then(user => {
      req.user = user
      next()
    })
    .catch(err => {
      console.log(err)
    })
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(errorController.get404)

mongoose
  .connect(
    `mongodb+srv://tidgomes:${process.env.DB_PASSWORD}@cluster0.gomczzm.mongodb.net/shop?retryWrites=true&w=majority`
  )
  .then(() => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Test User',
          email: 'testuser@mail.com',
          cart: { items: [] }
        })
        user.save()
      }
    })
    console.log('Connected to the database')
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })
