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

  getCart() {
    const db = getDb()
    const productIds = this.cart.items.map(item => item.productId)
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(prod => ({
          ...prod,
          quantity: this.cart.items.find(
            item => item.productId.toString() === prod._id.toString()
          ).quantity
        }))
      })
      .catch(err => {
        console.log(err)
      })
  }

  deleteCartItem(productId) {
    const db = getDb()
    const updatedCartItems = this.cart.items.filter(
      item => item.productId.toString() !== productId.toString()
    )
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      )
  }

  addOrder() {
    const db = getDb()
    return db
      .collection('orders')
      .insertOne(this.cart)
      .then(() => {
        this.cart = []
        return db.collection('users').updateOne(
          { _id: new mongodb.ObjectId(this._id) },
          { $set: { cart: { items: [] } } }
        )
      })
      .catch(err => {
        console.log(err)
      })
  }

  static findById(prodId) {
    const db = getDb()
    const userObjectId = new mongodb.ObjectId(prodId)

    return db.collection('users').findOne({ _id: userObjectId })
  }
}

module.exports = User
