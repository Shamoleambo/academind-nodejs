const Cart = require('../models/cart')
const db = require('../utils/database')
module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products')
  }

  static findById(id) {}

  static deleteById(id) {}

  save() {
    return db.execute(
      'INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.description, this.imageUrl]
    )
  }
}
