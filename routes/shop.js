const path = require('path')
const express = require('express')
const adminData = require('./admin')
const rootDir = require('../utils/path')

const router = express.Router()

router.get('/', (req, res) => {
  res.render('shop')
})

module.exports = router
