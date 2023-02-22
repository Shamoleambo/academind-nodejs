const Product = require('../models/product')

exports.getIndex = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/index', { pageTitle: 'Shop', path: '/', products })
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res) => {
  Product.find()
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

exports.getCart = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postCart = (req, res) => {
  const prodId = req.body.productId
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product)
    })
    .then(result => {
      console.log(result)
      res.redirect('/cart')
    })
}

exports.deleteCartItem = (req, res) => {
  const prodId = req.body.productId
  req.user
    .deleteCartItem(prodId)
    .then(() => {
      console.log('Product Deleted')
      res.redirect('/cart')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getOrders = (req, res) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postOrder = (req, res) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect('/orders')
    })
    .catch(err => {
      console.log(err)
    })
}
