/**
 * Title: Write a program using JavaScript on Restrict Middleware

 * Date: 20, November 2023
 */

const User = require("../models/user.model");

async function restrict(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (user.store) {
      return res.status(405).json({
        acknowledgement: false,
        message: "Not Allowed",
        description:
          "Already having store is not allow to create another store",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = restrict;
