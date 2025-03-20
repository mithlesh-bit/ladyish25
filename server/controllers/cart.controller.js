/**Nikhil Verma*/

/* internal import */
const cartService = require("../services/cart.service");

/* add to cart */
exports.addToCart = async (req, res, next) => {
  try {
    await cartService.addToCart(req, res);
  } catch (error) {
    next(error);
  }
};

/* get from cart */
exports.getFromCart = async (req, res, next) => {
  try {
    await cartService.getFromCart(res);
  } catch (error) {
    next(error);
  }
};

/* update cart */
exports.updateCart = async (req, res, next) => {
  try {
    await cartService.updateCart(req, res);
  } catch (error) {
    next(error);
  }
};

/* delete cart */
exports.deleteCart = async (req, res, next) => {
  try {
    await cartService.deleteCart(req, res);
  } catch (error) {
    next(error);
  }
};
