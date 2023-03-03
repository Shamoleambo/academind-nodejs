const fs = require('fs')
const path = require('path')
const PDFDocument = require('pdfkit')
const dotenv = require('dotenv')
const Product = require('../models/product')
const User = require('../models/user')
const Order = require('../models/order')

dotenv.config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const ITEMS_PER_PAGE = 3

exports.getIndex = async (req, res, next) => {
  const currentPage = parseInt(req.query.page) || 1
  const totalProducts = await Product.find().countDocuments()
  lastPage = Math.ceil(totalProducts / ITEMS_PER_PAGE)

  Product.find()
    .skip((currentPage - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .then(products => {
      res.render('shop/index', {
        pageTitle: 'Shop',
        path: '/',
        products,
        currentPage,
        nextPage: currentPage + 1,
        previousPage: currentPage - 1,
        lastPage,
        hasNextPage: currentPage + 1 < lastPage,
        hasPreviousPage: currentPage - 1 > 0
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getProducts = async (req, res, next) => {
  const currentPage = parseInt(req.query.page) || 1
  const totalProducts = await Product.find().countDocuments()
  lastPage = Math.ceil(totalProducts / ITEMS_PER_PAGE)

  Product.find()
    .skip((currentPage - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .then(products => {
      res.render('shop/product-list', {
        pageTitle: 'All Products',
        path: '/products',
        products,
        currentPage,
        nextPage: currentPage + 1,
        previousPage: currentPage - 1,
        lastPage,
        hasNextPage: currentPage + 1 < lastPage,
        hasPreviousPage: currentPage - 1 > 0
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
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
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getCart = (req, res) => {
  User.findById(req.session.user._id)
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
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
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
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
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
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getOrders = (req, res) => {
  Order.find({ 'user.userId': req.session.user._id })
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
        orders
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
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
          email: req.session.user.email,
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
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getCheckout = (req, res, next) => {
  let products
  let totalAmount = 0
  req.user
    .populate('cart.items.productId')
    .then(user => {
      products = user.cart.items
      products.forEach(item => {
        totalAmount += item.productId.price * item.quantity
      })

      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: products.map(prod => {
          return {
            quantity: prod.quantity,
            price_data: {
              currency: 'usd',
              unit_amount: prod.productId.price * 100,
              product_data: {
                name: prod.productId.title,
                description: prod.productId.description
              }
            }
          }
        }),
        customer_email: req.user.email,
        success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
        cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`
      })
    })
    .then(session => {
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products,
        totalAmount,
        sessionId: session.id
      })
    })
    .catch(err => {
      console.log(err)
      const error = new Error(err)
      error.httpStatusCode = 500
      next(error)
    })
}

exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId
  Order.findById(orderId)
    .then(order => {
      if (!order) {
        return next(new Error('No order found.'))
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error('Unauthorized'))
      }
      const invoiceName = 'invoice-' + orderId + '.pdf'
      const invoicePath = path.join('data', 'invoices', invoiceName)

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`)

      const pdfDoc = new PDFDocument()
      pdfDoc.pipe(fs.createWriteStream(invoicePath))
      pdfDoc.pipe(res)

      pdfDoc.fontSize(26).text('Invoice', { underline: true })
      pdfDoc.text('------------------------------')
      let totalPrice = 0
      order.products.forEach(prod => {
        pdfDoc
          .fontSize(14)
          .text(
            `${prod.product.title} - ${prod.quantity} x $${prod.product.price}`
          )
        totalPrice += prod.product.price * prod.quantity
      })
      pdfDoc.text('------------------------------')
      pdfDoc.fontSize(20).text(`Total: $${totalPrice}.`)

      pdfDoc.end()
    })
    .catch(err => {
      next(err)
    })
}
