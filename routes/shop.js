const express = require('express')
const shopController = require('../controller/shop')

const router = express.Router()

router.get('/', shopController.getIndex)
router.get('/products', shopController.getProducts)
router.get('/products/:productId', shopController.getProduct)
router.post('/cart', shopController.postCart)

module.exports = router
