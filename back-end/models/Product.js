// models/Product.js

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String } // URL to the product image
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;