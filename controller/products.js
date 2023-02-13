const Product = require('../models/product')

exports.getAddProduct = (req, res) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    productCSS: true,
    formsCSS: true
  })
}

exports.postAddProduct = (req, res) => {
  const product = new Product(req.body.title)
  product.save()
  res.redirect('/')
}

exports.getProducts = (req, res) => {
  Product.fetchAll(products => {
    res.render('shop/product-list', {
      products,
      pageTitle: 'Products',
      path: '/products',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    })
  })
}

exports.getShopPage = (req, res) => {
  res.render('shop/index', { pageTitle: 'Shop', path: '/' })
}

exports.getCart = (req, res) => {
  res.render('shop/cart', { pageTitle: 'Cart', path: '/cart' })
}

exports.getAdminProducts = (req, res) => {
  res.render('admin/products', {
    pageTitle: 'Admin Products',
    path: '/admin/products'
  })
}
