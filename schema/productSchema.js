const mongoose = require("mongoose");

const Productschema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true },
    description: { type: String, required: true },
    stock: {
      type: String,
      required: true,
      default: "on-stock",
      enum: ["on-stock", "out-of-stock"],
    },
    colors: { type: [String], required: true },
    sizes: { type: [String], required: true },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

const collection = mongoose.model("Products", Productschema);
module.exports = collection;
