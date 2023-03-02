const { validationResult } = require('express-validator/check')
const Product = require('../models/product')

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  })
}

exports.postAddProduct = (req, res) => {
  const title = req.body.title
  const price = req.body.price
  const description = req.body.description
  const imageUrl = req.body.imageUrl
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      path: '/admin/add-product',
      pageTitle: 'Add Product',
      editing: false,
      hasError: true,
      product: { title, imageUrl, price, description },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    })
  }

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
      res.redirect('/500')
    })
}

exports.getProducts = (req, res) => {
  Product.find({ userId: req.user })
    .then(products => {
      res.render('admin/products', {
        pageTitle: 'Products',
        path: '/admin/products',
        products
      })
    })
    .catch(err => console.log(err))
}

exports.getEditProduct = (req, res) => {
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
      console.log(err)
    })
}

exports.postEditProduct = async (req, res) => {
  const prodId = req.body.productId

  const updatedTitle = req.body.title
  const updatedPrice = req.body.price
  const updatedDescription = req.body.description
  const updatedImageUrl = req.body.imageUrl

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('admin/edit-product', {
      path: null,
      pageTitle: 'Edit Product',
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
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
      product.imageUrl = updatedImageUrl

      return product.save().then(() => {
        console.log('Product Updated')
        res.redirect('/admin/products')
      })
    })
    .catch(err => {
      console.log(err)
    })
}

exports.deleteProduct = (req, res) => {
  const prodId = req.body.productId
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      console.log('Product Deleted')
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}
