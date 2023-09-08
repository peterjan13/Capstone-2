const mongoose = require("mongoose");
const User = require("./User.js");

// Schema for order
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // Reference to the User model
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      name: {
        type: String, // Add a field for product name
        required: true,
      },
      price: {
        type: Number, // Add a field for product price
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: false, // Make totalAmount not required
  },
  purchasedOn: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Order", orderSchema);
