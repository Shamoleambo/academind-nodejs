const mongodb = require('mongodb')
const { getDb } = require('../utils/database')
class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
    this._id = id
  }

  save() {
    const db = getDb()
    if (this._id) {
      return db
        .collection('products')
        .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this })
    } else {
      return db
        .collection('products')
        .insertOne(this)
        .then(result => {
          console.log(result)
        })
        .catch(err => console.log(err))
    }
  }

  static fetchAll() {
    const db = getDb()
    return db.collection('products').find().toArray()
  }

  static findById(prodId) {
    const db = getDb()
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next()
  }
}

module.exports = Product
