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
  const description = req.body.description
  const imageUrl = req.body.imageUrl

  const product = new Product(title, price, description, imageUrl)

  product
    .save()
    .then(result => {
      console.log('Product Created')
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res) => {
  Product.fetchAll()
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
        editing
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

  const product = new Product(
    updatedTitle,
    updatedPrice,
    updatedDescription,
    updatedImageUrl,
    prodId
  )

  product
    .save()
    .then(result => {
      console.log('Product updated')
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}
