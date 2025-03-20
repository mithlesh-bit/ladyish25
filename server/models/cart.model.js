

/* External imports */
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

/* Create cart schema */
const cartSchema = new mongoose.Schema(
  {
    // Reference to the product
    product: {
      type: ObjectId,
      ref: "Product",
      required: true,
    },

    // Reference to the user
    user: {
      type: ObjectId,
      ref: "User",
      required: true,
    },

    // Quantity of the product
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: [1, "Quantity must be at least 1"],
    },

    // Selected color (if applicable)
    color: {
      type: String,
      default: null,
    },

    // Selected size (if applicable)
    size: {
      type: String,
      default: null,
    },

    // Timestamps for when the cart item was created or updated
  },
  { timestamps: true }
);

/* Create and export cart model */
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
