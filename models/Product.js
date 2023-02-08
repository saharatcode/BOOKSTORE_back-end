const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, default: null},
    secondName: { type: String, default: null},
    author: { type: String, required: true},
    publishedTranslator: { type: String, default: null },
    publisher: { type: String, default: null },
    desc: { type: String, default: null },
    img: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    // sellingPrice: { type: Number, required: true },
    cost: { type: Number, required: true },
    totalPage: { type: Number, default:null},
    isbn: { type: Number, default: null},
    discount: { type: Number, default: 0},
    inStock: { type: Boolean, default: true },
    amount: { type: Number, default: 1,  required: true}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);