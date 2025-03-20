/**
 * Title: Write a program using JavaScript on Favorite Model

 * Date: 09, January 2024
 */

/* external imports */
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

/* create favorite schema */
const favoriteSchema = new mongoose.Schema(
  {
    // for user
    user: {
      type: ObjectId,
      ref: "User",
    },

    // for product
    product: {
      type: ObjectId,
      ref: "Product",
    },

    // for user account time stamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

/* create favorite model */
const Favorite = mongoose.model("Favorite", favoriteSchema);

/* export favorite model */
module.exports = Favorite;
