const path = require('path')
const express = require('express')
const adminData = require('./admin')
const rootDir = require('../utils/path')

const router = express.Router()

router.get('/', (req, res) => {
  const products = adminData.products
  res.render('shop', { products, docTitle: 'Shop' })
})

module.exports = router
