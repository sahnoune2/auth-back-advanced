const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  panier: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
      quantity: {type:Number},
    },
  ],
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "rejected", "received"],
  },
});
const orders = mongoose.model("orders", orderSchema);
module.exports = orders;
