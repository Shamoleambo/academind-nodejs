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
  Product.create({
    title,
    price,
    imageUrl,
    description
  })
    .then(result => console.log('Product Created'))
    .catch(err => console.log(err))

  const product = new Product(null, title, imageUrl, description, price)
  product
    .save()
    .then(() => {
      res.redirect('/')
    })
    .catch(err => {
      console.log(err)
    })
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
  Product.findById(prodId, product => {
    if (!prodId) return res.redirect('/')

    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product
    })
  })
}

exports.postEditProduct = (req, res) => {
  const prodId = req.body.productId
  const updatedTitle = req.body.title
  const updatedImgUrl = req.body.imageUrl
  const updatedDescription = req.body.description
  const updatedPrice = req.body.price

  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImgUrl,
    updatedDescription,
    updatedPrice
  )
  updatedProduct.save()
  res.redirect('/')
}

exports.postDeleteProduct = (req, res) => {
  const prodId = req.body.productId
  Product.deleteById(prodId)
  res.redirect('/admin/products')
}
