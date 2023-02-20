const mongoose = require('mongoose')

const Schema = mongoose.Schema

const productSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true }
})

module.exports = mongoose.model('Product', productSchema)

// const mongodb = require('mongodb')
// const { getDb } = require('../utils/database')
// class Product {
//   constructor(title, price, description, imageUrl, id = null, userId) {
//     this.title = title
//     this.price = price
//     this.description = description
//     this.imageUrl = imageUrl
//     this.userId = userId
//     if (id) {
//       this._id = new mongodb.ObjectId(id)
//     }
//   }

//   save() {
//     const db = getDb()
//     if (this._id) {
//       return db
//         .collection('products')
//         .updateOne({ _id: this._id }, { $set: this })
//     } else {
//       return db
//         .collection('products')
//         .insertOne(this)
//         .then(result => {
//           console.log(result)
//         })
//         .catch(err => console.log(err))
//     }
//   }

//   static fetchAll() {
//     const db = getDb()
//     return db.collection('products').find().toArray()
//   }

//   static findById(productId) {
//     const db = getDb()
//     return db
//       .collection('products')
//       .find({ _id: new mongodb.ObjectId(productId) })
//       .next()
//   }

//   static deleteById(productId) {
//     const db = getDb()
//     return db
//       .collection('products')
//       .deleteOne({ _id: new mongodb.ObjectId(productId) })
//   }
// }

// module.exports = Product
