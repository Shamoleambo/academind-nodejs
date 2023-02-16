const Product = require('../models/product')

exports.getIndex = (req, res) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', { pageTitle: 'Shop', path: '/', products })
    })
    .catch(err => console.log(err))
}
