const mongodb = require('mongodb')
const { getDb } = require('../utils/database')

class User {
  constructor(name, email) {
    this.name = name
    this.email = email
  }

  save() {
    const db = getDb()

    return db.collection('users').insertOne(this)
  }

  static findById(prodId) {
    const db = getDb()
    const userObjectId = new mongodb.ObjectId(prodId)

    return db.collection('users').findOne({ _id: userObjectId })
  }
}

module.exports = User
