/**
 * Title: Write a program using JavaScript on Cart Service

 * Date: 09, January 2024
 */

/* internal imports */
const Cart = require("../models/cart.model");
const User = require("../models/user.model");

/* add to cart */
/* add to cart */
/* add to cart */
exports.addToCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        acknowledgement: false,
        message: "Failed",
        description: "User not found",
      });
    }

    const { product, quantity, color, size } = req.body;

    const cart = new Cart({
      user: user._id,
      product: product,
      quantity: quantity,
      color: color || null,
      size: size || null,
    });

    // Save the cart item
    const savedCart = await cart.save();
    //// console.log("Cart item saved successfully:", savedCart);

    // Update the user's cart array
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $push: { cart: savedCart._id } },
      { new: true } // Return the updated user document
    );

    // Respond with success
    return res.status(201).json({
      acknowledgement: true,
      message: "Ok",
      description: "Product added to cart successfully",
      cart: savedCart,
    });
  } catch (error) {
    console.error("Unexpected error in addToCart:", error);

    // Handle unexpected errors
    if (!res.headersSent) {
      return res.status(500).json({
        acknowledgement: false,
        message: "Failed",
        description: "An unexpected error occurred",
        error: error.message,
      });
    }
  }
};






/* get from cart */
exports.getFromCart = async (res) => {
  const cart = await Cart.find().populate(["user", "product"]);

  res.status(200).json({
    acknowledgement: true,
    message: "Ok",
    description: "Cart fetched successfully",
    data: cart,
  });
};

/* update cart */
exports.updateCart = async (req, res) => {
  await Cart.findByIdAndUpdate(req.params.id, req.body);

  res.status(200).json({
    acknowledgement: true,
    message: "Ok",
    description: "Cart updated successfully",
  });
};

/* delete cart */
exports.deleteCart = async (req, res) => {


  const cart = await Cart.findByIdAndDelete(req.params.id);

  await User.findByIdAndUpdate(cart.user, {
    $pull: { cart: cart._id },
  });

  res.status(200).json({
    acknowledgement: true,
    message: "Ok",
    description: "Cart deleted successfully",
  });
};
