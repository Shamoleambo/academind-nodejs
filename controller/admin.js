const { validationResult } = require('express-validator/check')
const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  })
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title
  const price = req.body.price
  const description = req.body.description
  const image = req.file
  const errors = validationResult(req)

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      path: '/admin/add-product',
      pageTitle: 'Add Product',
      editing: false,
      hasError: true,
      product: { title, price, description },
      errorMessage: 'Attached file is not an image',
      validationErrors: errors.array()
    })
  }
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      path: '/admin/add-product',
      pageTitle: 'Add Product',
      editing: false,
      hasError: true,
      product: { title, price, description },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    })
  }

  const imageUrl = image.path

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.session.user
  })

  product
    .save()
    .then(result => {
      console.log('Product Created')
      res.redirect('/admin/products')
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user })
    .then(products => {
      res.render('admin/products', {
        pageTitle: 'Products',
        path: '/admin/products',
        products
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId
  const editing = req.query.edit
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
        hasError: false,
        errorMessage: null,
        validationErrors: []
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.postEditProduct = async (req, res, next) => {
  const prodId = req.body.productId
  const updatedTitle = req.body.title
  const updatedPrice = req.body.price
  const updatedDescription = req.body.description
  const image = req.file
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('admin/edit-product', {
      path: null,
      pageTitle: 'Edit Product',
      product: {
        title: updatedTitle,
        price: updatedPrice,
        description: updatedDescription
      },
      editing: true,
      hasError: true,
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
      _id: prodId
    })
  }

  Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/')
      }

      product.title = updatedTitle
      product.price = updatedPrice
      product.description = updatedDescription
      if (image) {
        product.imageUrl = image.path
      }

      return product.save().then(() => {
        console.log('Product Updated')
        res.redirect('/admin/products')
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}

exports.deleteProduct = (req, res, next) => {
  const prodId = req.body.productId
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      console.log('Product Deleted')
      res.redirect('/admin/products')
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}
