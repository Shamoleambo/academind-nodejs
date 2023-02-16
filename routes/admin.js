const express = require('express')
const adminController = require('../controller/admin')

const router = express.Router()

router.get('/add-product', adminController.getAddProduct)

module.exports = router
