const express = require('express')
const { body } = require('express-validator/check')
const adminController = require('../controller/admin')
const isAuth = require('../middleware/is-auth')

const router = express.Router()

router.get('/add-product', isAuth, adminController.getAddProduct)
router.post(
  '/add-product',
  isAuth,
  [
    body('title').isString().isLength({ min: 3 }),
    body('price').isFloat(),
    body('description').isLength({ min: 5, max: 400 }).trim()
  ],
  adminController.postAddProduct
)
router.get('/products', isAuth, adminController.getProducts)
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct)
router.post(
  '/edit-product',
  isAuth,
  [
    body('title').isString().isLength({ min: 3 }),
    body('price').isFloat(),
    body('description').isLength({ min: 5, max: 400 }).trim()
  ],
  adminController.postEditProduct
)
router.delete('/products/:productId', isAuth, adminController.deleteProduct)

module.exports = router
