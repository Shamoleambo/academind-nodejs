const Product = require('../models/product')

exports.getIndex = (req, res) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', { pageTitle: 'Shop', path: '/', products })
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        pageTitle: 'All Products',
        path: '/products',
        products
      })
    })
    .catch(err => console.log(err))
}

exports.getProduct = (req, res) => {
  const prodId = req.params.productId
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        pageTitle: product.title,
        path: '/products',
        product
      })
    })
    .catch(err => console.log(err))
}
