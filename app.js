const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const dotenv = require('dotenv')
const errorController = require('./controller/error')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')
const User = require('./models/user')

dotenv.config()
const MONGODB_URI = `mongodb+srv://tidgomes:${process.env.DB_PASSWORD}@cluster0.gomczzm.mongodb.net/shop?retryWrites=true&w=majority`

const app = express()
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use((req, res, next) => {
  User.findById('63f8d977cffbf8b3f87ddd7e')
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
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
  })
)

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.use(errorController.get404)

mongoose
  .connect(MONGODB_URI)
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
