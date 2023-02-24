const Product = require('../models/product')

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  })
}

exports.postAddProduct = (req, res) => {
  const title = req.body.title
  const price = req.body.price
  const description = req.body.description
  const imageUrl = req.body.imageUrl

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user
  })

  product
    .save()
    .then(result => {
      console.log('Product Created')
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res) => {
  Product.find()
    .then(products => {
      res.render('admin/products', {
        pageTitle: 'Products',
        path: '/admin/products',
        products,
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

exports.getEditProduct = (req, res) => {
  const prodId = req.params.productId
  const editing = req.query.editing
  if (!editing) {
    return res.redirect('/')
  }
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/')
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: null,
        product,
        editing,
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.postEditProduct = async (req, res) => {
  const prodId = req.body.productId

  const updatedTitle = req.body.title
  const updatedPrice = req.body.price
  const updatedDescription = req.body.description
  const updatedImageUrl = req.body.imageUrl

  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle
      product.price = updatedPrice
      product.description = updatedDescription
      product.imageUrl = updatedImageUrl

      return product.save()
    })
    .then(() => {
      console.log('Product Updated')
      res.redirect('/admin/products')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.deleteProduct = (req, res) => {
  const prodId = req.body.productId
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('Product Deleted')
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}
