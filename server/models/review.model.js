/**
 * Title: Write a program using JavaScript on Review Model

 * Date: 09, January 2024
 */

/* external imports */
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

/* create review schema */
const reviewSchema = new mongoose.Schema(
  {
    // for reviewer
    reviewer: {
      type: ObjectId,
      ref: "User",
    },

    // for product
    product: {
      type: ObjectId,
      ref: "Product",
    },

    // for rating
    rating: {
      type: Number,
      required: [true, "Please, provide a rating"],
      min: 1,
      max: 5,
    },

    // for comment
    comment: {
      type: String,
      required: [true, "Please, provide a comment"],
      maxLength: [200, "Your comment should be at most 200 characters"],
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

/* create review model */
const Review = mongoose.model("Review", reviewSchema);

/* export Review model */
module.exports = Review;
