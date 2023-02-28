const express = require('express')
const adminController = require('../controller/admin')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

router.get('/add-product', isAuth, adminController.getAddProduct)
router.post('/add-product', isAuth, adminController.postAddProduct)
router.get('/products', isAuth, adminController.getProducts)
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)
router.post('/edit-product', isAuth, adminController.postEditProduct)
router.post('/delete-product', isAuth, adminController.deleteProduct)

module.exports = router
