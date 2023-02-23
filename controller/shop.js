const Product = require('../models/product')
const Order = require('../models/order')

exports.getIndex = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        pageTitle: 'Shop',
        path: '/',
        products,
        isAuthenticated: null
      })
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        pageTitle: 'All Products',
        path: '/products',
        products,
        isAuthenticated: null
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
        product,
        isAuthenticated: null
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
        products,
        isAuthenticated: null
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
    .deleteProductFromCart(prodId)
    .then(() => {
      console.log('Product Deleted')
      res.redirect('/cart')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getOrders = (req, res) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders,
        isAuthenticated: null
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postOrder = (req, res) => {
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(prod => ({
        quantity: prod.quantity,
        product: { ...prod.productId._doc }
      }))

      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user
        },
        products
      })

      return order.save()
    })
    .then(() => req.user.clearCart())
    .then(() => {
      res.redirect('/orders')
    })
    .catch(err => {
      console.log(err)
    })
}
