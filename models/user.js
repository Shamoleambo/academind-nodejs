const mongoose = require('mongoose')
const Product = require('./product')

const Schema = mongoose.Schema

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
})

userSchema.methods.addToCart = function (product) {
  const cartProductIndex = this.cart.items.findIndex(
    cartProduct => cartProduct.productId.toString() === product._id.toString()
  )

  const updatedCartItems = this.cart.items

  if (cartProductIndex >= 0) {
    updatedCartItems[cartProductIndex].quantity += 1
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: 1
    })
  }

  const updatedCart = {
    items: updatedCartItems
  }

  this.cart = updatedCart
  return this.save()
}

userSchema.methods.deleteProductFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    product => product._id.toString() !== productId.toString()
  )

  this.cart.items = updatedCartItems
  return this.save()
}

userSchema.methods.clearCart = function () {
  this.cart = { items: [] }
  return this.save()
}

module.exports = mongoose.model('User', userSchema)

// const mongodb = require('mongodb')
// const { getDb } = require('../utils/database')

// class User {
//   constructor(name, email, cart, id) {
//     this.name = name
//     this.email = email
//     this.cart = cart
//     this._id = id
//   }

//   save() {
//     const db = getDb()

//     return db.collection('users').insertOne(this)
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(
//       cartProduct => cartProduct.productId.toString() === product._id.toString()
//     )

//     const updatedCartItems = this.cart.items

//     if (cartProductIndex >= 0) {
//       updatedCartItems[cartProductIndex].quantity += 1
//     } else {
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: 1
//       })
//     }

//     const updatedCart = {
//       items: updatedCartItems
//     }

//     const db = getDb()
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       )
//   }

//   getCart() {
//     const db = getDb()
//     const productIds = this.cart.items.map(item => item.productId)
//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products => {
//         return products.map(prod => ({
//           ...prod,
//           quantity: this.cart.items.find(
//             item => item.productId.toString() === prod._id.toString()
//           ).quantity
//         }))
//       })
//       .catch(err => {
//         console.log(err)
//       })
//   }

//   deleteCartItem(productId) {
//     const db = getDb()
//     const updatedCartItems = this.cart.items.filter(
//       item => item.productId.toString() !== productId.toString()
//     )
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       )
//   }

//   async addOrder() {
//     const db = getDb()

//     const products = await this.getCart()
//     const order = {
//       items: products,
//       user: { _id: new mongodb.ObjectId(this._id), name: this.name }
//     }

//     return db
//       .collection('orders')
//       .insertOne(order)
//       .then(() => {
//         this.cart = []
//         return db
//           .collection('users')
//           .updateOne(
//             { _id: new mongodb.ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           )
//       })
//       .catch(err => {
//         console.log(err)
//       })
//   }

//   getOrders() {
//     const db = getDb()

//     return db
//       .collection('orders')
//       .find({ 'user._id': new mongodb.ObjectId(this._id) }).toArray()
//   }

//   static findById(prodId) {
//     const db = getDb()
//     const userObjectId = new mongodb.ObjectId(prodId)

//     return db.collection('users').findOne({ _id: userObjectId })
//   }
// }

// module.exports = User
