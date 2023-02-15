const Product = require('../models/product')

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  })
}

exports.postAddProduct = (req, res) => {
  const title = req.body.title
  const price = req.body.price
  const imageUrl = req.body.imageUrl
  const description = req.body.description
  req.user
    .createProduct({
      title,
      price,
      imageUrl,
      description
    })
    .then(result => {
      console.log('Product Created')
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res) => {
  Product.findAll()
    .then(products => {
      res.render('admin/products', {
        pageTitle: 'Admin Products',
        path: '/admin/products',
        products
      })
    })
    .catch(err => console.log(err))
}

exports.getEditProduct = (req, res) => {
  const editMode = req.query.editing
  if (!editMode) {
    return res.redirect('/')
  }
  const prodId = req.params.productId
  Product.findByPk(prodId)
    .then(product => {
      if (!prodId) return res.redirect('/')

      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product
      })
    })
    .catch(err => console.log(err))
}

exports.postEditProduct = (req, res) => {
  const prodId = req.body.productId
  const updatedTitle = req.body.title
  const updatedPrice = req.body.price
  const updatedImgUrl = req.body.imageUrl
  const updatedDescription = req.body.description

  Product.findByPk(prodId)
    .then(product => {
      product.title = updatedTitle
      product.price = updatedPrice
      product.imageUrl = updatedImgUrl
      product.description = updatedDescription
      return product.save()
    })
    .then(result => {
      console.log('Updated Product')
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.productId
  Product.findByPk(prodId)
    .then(product => {
      return product.destroy()
    })
    .then(result => {
      console.log('Product Deleted')
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}
