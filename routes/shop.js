const path = require('path')
const express = require('express')
const productsController = require('../controller/products')

const router = express.Router()

router.get('/', productsController.getShopPage)
router.get('/products', productsController.getProducts)
router.get('/cart', productsController.getCart)

module.exports = router
