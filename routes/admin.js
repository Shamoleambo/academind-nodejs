const path = require('path')
const express = require('express')
const productsController = require('../controller/products')

const router = express.Router()

router.get('/add-product', productsController.getAddProduct)
router.post('/add-product', productsController.postAddProduct)
router.get('/products', productsController.getAdminProducts)

module.exports = router
