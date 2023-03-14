const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const multer = require('multer')
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')
const flash = require('connect-flash')
const dotenv = require('dotenv')
const helmet = require('helmet')
const compression = require('compression')
const errorController = require('./controller/error')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')
const User = require('./models/user')

dotenv.config()
const MONGODB_URI = `mongodb+srv://tidgomes:${process.env.DB_PASSWORD}@cluster0.gomczzm.mongodb.net/shop?retryWrites=true&w=majority`

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + '-' + file.originalname)
  }
})
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const app = express()
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})
const csrfProtection = csrf()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(helmet())
app.use(compression())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(multer({ storage: fileStorage, fileFilter }).single('image'))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
  })
)
app.use(csrfProtection)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})
app.use(flash())

app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }

  User.findOne({ _id: req.session.user._id })
    .then(user => {
      if (!user) {
        return next()
      }

      req.user = user
      next()
    })
    .catch(err => {
      next(new Error(err))
    })
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)
app.use('/500', errorController.get500)
app.use(errorController.get404)

app.use((error, req, res, next) => {
  console.log(error)
  res.status(500).render('500', {
    pageTitle: 'Error',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
    csrfToken: ''
  })
})

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to the database')
    app.listen(3000)
  })
  .catch(err => {
    console.log(err)
  })
