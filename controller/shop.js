const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then(([rows]) => {
      res.render('shop/product-list', {
        products: rows,
        pageTitle: 'All Products',
        path: '/products'
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getProduct = (req, res) => {
  const prodId = req.params.productId
  Product.findById(prodId)
    .then(([product]) => {
      res.render('shop/product-detail', {
        pageTitle: product[0].title,
        path: '/products',
        product: product[0]
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getIndex = (req, res) => {
  Product.fetchAll()
    .then(([rows]) => {
      res.render('shop/index', {
        products: rows,
        pageTitle: 'Shop',
        path: '/'
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getCart = (req, res) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = []
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => product.id === prod.id
        )
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty })
        }
      }
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: cartProducts
      })
    })
  })
}

exports.postCart = (req, res) => {
  const prodId = req.body.productId
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price)
  })
  res.redirect('/cart')
}

exports.postCartDeleteProduct = (req, res) => {
  const prodId = req.body.productId
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price)
    res.redirect('/cart')
  })
}

exports.getOrders = (req, res) => {
  res.render('shop/orders', { pageTitle: 'Your Orders', path: '/orders' })
}

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', { pageTitle: 'Checkout', path: '/checkout' })
}
