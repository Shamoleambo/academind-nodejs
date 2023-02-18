const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const errorController = require('./controller/error')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const User = require('./models/user')
const { mongoConnect } = require('./utils/database')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(async (req, res, next) => {
  const user = await User.findById('63efcf0c4aecceab41d91f22')
  req.user = new User(user.name, user.email, user.cart, user._id)
  next()
})

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(errorController.get404)

mongoConnect(() => {
  app.listen(3000)
})
