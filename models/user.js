const mongodb = require('mongodb')
const { getDb } = require('../utils/database')

class User {
  constructor(name, email, cart, id) {
    this.name = name
    this.email = email
    this.cart = cart
    this._id = id
  }

  save() {
    const db = getDb()

    return db.collection('users').insertOne(this)
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(
      cartProduct => cartProduct.productId.toString() === product._id.toString()
    )

    const updatedCartItems = this.cart.items

    if (cartProductIndex >= 0) {
      updatedCartItems[cartProductIndex].quantity += 1
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: 1
      })
    }

    const updatedCart = {
      items: updatedCartItems
    }

    const db = getDb()
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      )
  }

  static findById(prodId) {
    const db = getDb()
    const userObjectId = new mongodb.ObjectId(prodId)

    return db.collection('users').findOne({ _id: userObjectId })
  }
}

module.exports = User
