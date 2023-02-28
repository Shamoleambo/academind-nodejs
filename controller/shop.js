const Product = require('../models/product')
const User = require('../models/user')
const Order = require('../models/order')

exports.getIndex = (req, res) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        pageTitle: 'Shop',
        path: '/',
        products
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
        isAuthenticated: req.session.isLoggedIn
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
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.getCart = (req, res) => {
  User.findById(req.session.user._id)
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products,
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postCart = async (req, res) => {
  const prodId = req.body.productId
  const user = await User.findById(req.session.user._id)
  Product.findById(prodId)
    .then(product => {
      return user.addToCart(product)
    })
    .then(result => {
      console.log(result)
      res.redirect('/cart')
    })
}

exports.deleteCartItem = (req, res) => {
  const prodId = req.body.productId
  User.findById(req.session.user._id)
    .then(async user => {
      await user.deleteProductFromCart(prodId)
      console.log('Product Deleted')
      res.redirect('/cart')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getOrders = (req, res) => {
  Order.find({ 'user.userId': req.session.user._id })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders,
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postOrder = async (req, res) => {
  const user = await User.findById(req.session.user._id)
  user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items.map(prod => ({
        quantity: prod.quantity,
        product: { ...prod.productId._doc }
      }))

      const order = new Order({
        user: {
          name: req.session.user.name,
          userId: req.session.user
        },
        products
      })

      return order.save()
    })
    .then(() => user.clearCart())
    .then(() => {
      res.redirect('/orders')
    })
    .catch(err => {
      console.log(err)
    })
}
