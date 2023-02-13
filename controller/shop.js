const Product = require('../models/product')

exports.getProducts = (req, res) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      products,
      pageTitle: 'All Products',
      path: '/products'
    })
  })
}

exports.getProduct = (req, res) => {
  const prodId = req.params.productId
  Product.findById(prodId, product => {
    console.log(product)
  })
  res.redirect('/')
}

exports.getIndex = (req, res) => {
  Product.fetchAll(products => {
    res.render('shop/index', {
      products,
      pageTitle: 'Shop',
      path: '/'
    })
  })
}

exports.getCart = (req, res) => {
  res.render('shop/cart', { pageTitle: 'Your Cart', path: '/cart' })
}

exports.getOrders = (req, res) => {
  res.render('shop/orders', { pageTitle: 'Your Orders', path: '/orders' })
}

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' })
}
