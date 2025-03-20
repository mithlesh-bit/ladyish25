/* internal imports */
const userService = require("../services/user.service");

/* sign up an user */
exports.signUp = async (req, res, next) => {
  try {
    await userService.signUp(req, res);
  } catch (error) {
    next(error);
  } finally {
    //// console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
};

/* sign in an user */
exports.signIn = async (req, res, next) => {
  try {
    await userService.signIn(req, res);
  } catch (error) {
    next(error);
  } finally {
    // //// console.log(5468);
    //// console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
};

exports.otp = async (req, res, next) => {
  try {
    await userService.otp(req, res);
  } catch (error) {
    next(error);
  } finally {
    //// console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
};

/* reset user password */
exports.forgotPassword = async (req, res, next) => {
  try {
    await userService.forgotPassword(req, res);
  } catch (error) {
    next(error);
  } finally {
    //// console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
};

/* login persistance */
exports.persistLogin = async (req, res, next) => {
  try {
    await userService.persistLogin(req, res);
  } catch (error) {
    next(error);
  } finally {
    //// console.log(`Route111: ${req.url} || Method: ${req.method}`);
  }
};

/* get all users */
exports.getUsers = async (req, res, next) => {
  try {
    await userService.getUsers(res);
  } catch (error) {
    next(error);
  } finally {
    //// console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
};

/* get single user */
exports.getUser = async (req, res, next) => {
  try {
    await userService.getUser(req, res);
  } catch (error) {
    next(error);
  } finally {
    //// console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
};
/* get single user */
exports.getSingleUser = async (req, res, next) => {
  try {
    const user = await userService.findUserById(req.params.id);
    res.status(200).json({
      acknowledgement: true,
      message: "OK",
      description: `${user.name}'s information retrieved successfully`,
      data: user,
    });
  } catch (error) {
    if (error.message === "User not found") {
      return res.status(404).json({
        acknowledgement: false,
        message: "User not found",
      });
    }
    next(error);
  }
};
exports.getUsersDetails = async (req, res, next) => {
  try {
    await userService.getUser(req, res);
  } catch (error) {
    next(error);
  }
};

/* update user information */
exports.updateUser = async (req, res, next) => {
  try {
    await userService.updateUser(req, res);
  } catch (error) {
    next(error);
  } finally {
    //// console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
};

/* update user information */
exports.updateUserInfo = async (req, res, next) => {
  try {
    await userService.updateUserInfo(req, res);
  } catch (error) {
    next(error);
  } finally {
    //// console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
};

/* delete user information */
exports.deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req, res);
  } catch (error) {
    next(error);
  } finally {
    //// console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
};

/* seller request & approve */
exports.getSellers = async (req, res, next) => {
  try {
    await userService.getSellers(res);
  } catch (error) {
    next(error);
  } finally {
    //// console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
};

exports.reviewSeller = async (req, res, next) => {
  try {
    await userService.reviewSeller(req, res);
  } catch (error) {
    next(error);
  } finally {
    //// console.log(`Route: ${req.url} || Method: ${req.method}`);
  }
};
