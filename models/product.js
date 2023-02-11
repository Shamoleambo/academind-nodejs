const fs = require('fs')
const path = require('path')

const p = path.join(
  path.dirname(require.main.filename),
  'data',
  'products.json'
)
module.exports = class Product {
  constructor(title) {
    this.title = title
  }

  static fetchAll(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([])
      } else {
        cb(JSON.parse(fileContent))
      }
    })
  }

  save() {
    fs.readFile(p, (err, fileContent) => {
      let products = []
      if (!err) {
        products = JSON.parse(fileContent)
      }
      products.push(this)
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err)
      })
    })
  }
}
