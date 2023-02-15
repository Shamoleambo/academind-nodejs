const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const errorController = require('./controller/error')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const sequelize = require('./utils/database')
const Product = require('./models/product')
const User = require('./models/user')

const app = express()

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(errorController.get404)

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' })
//The following is optional, since I can establish the relation between User and Product any way around
User.hasMany(Product)

sequelize
  .sync({ force: true })
  .then(result => {
    app.listen(3000, () =>
      console.log('Your applicaion is running on port 3000')
    )
  })
  .catch(err => console.log(err))
