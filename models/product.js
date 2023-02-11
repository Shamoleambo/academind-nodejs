const products = []

module.exports = class Product {
  constructor(title) {
    this.title = title
  }

  static fetchAll() {
    return products
  }

  save() {
    products.push(this)
  }
}
