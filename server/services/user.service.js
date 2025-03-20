/* internal imports */
const Brand = require("../models/brand.model");
const Cart = require("../models/cart.model");
const Category = require("../models/category.model");
const Favorite = require("../models/favorite.model");
const Product = require("../models/product.model");
const Purchase = require("../models/purchase.model");
const Review = require("../models/review.model");
const Store = require("../models/store.model");
const User = require("../models/user.model");
const remove = require("../utils/remove.util");
const token = require("../utils/token.util");
const nodemailer = require("nodemailer");
const crypto = require("crypto");



const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit random number
};


const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "ladyishcrochet@gmail.com",
    pass: "iutq grpj fqjq chbu",
  },
});

// Function to send mail with dynamic OTP
const sendMail = async (transporter, name, to, from, otp) => {
  const mailOptions = {
    from: { name: from.name, address: from.address },
    to: to,
    subject: 'Your Ladyish Account Verification Code',
    text: `Hello ${name},
  
  To verify your identity and access your Ladyish account, please enter the following 6-digit verification code:
  
  ${otp}
  
  If you did not request this code, please ignore this email.
  
  Thank you for helping us keep your account secure.
  
  Best regards,
  The Ladyish Team
  Contact us: support@ladyish.com
  Our address: 123 Ladyish Lane, Indore, MP, India
  `,
    html: `
      <p>Hello ${name},</p>
      <p>To verify your identity and access your Ladyish account, please enter the following 6-digit verification code:</p>
      <h2>${otp}</h2>
      <p>If you did not request this code, please ignore this email.</p>
      <p>Thank you for helping us keep your account secure.</p>
      <p>Best regards,<br>The Ladyish Team</p>
      <p>Contact us: <a href="mailto:contact.ladyish@gmail.com">contact.ladyish@gmail.com</a></p>
    `,
  };
  

  try {
    const result = await transporter.sendMail(mailOptions);
    //// console.log("Email sent successfully:", result);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const secretKey = "shezhuansauce"; // Make sure this is exactly the same as used for encryption
const IV_LENGTH = 16; // AES uses 16-byte IV

// const keyBuffer = Buffer.from(ENCRYPTION_KEY, 'utf8');
// const key = keyBuffer.length === 32 ? keyBuffer : keyBuffer.slice(0, 32);

const encrypt = (text) => {
  // // console.log("Encryption started"); // Remove or comment out if not needed
  const secret = "shezhuansauce";

  let key = crypto
    .createHash("sha256")
    .update(String(secret))
    .digest("base64")
    .substr(0, 32);
  // // console.log("Key (32 bytes):", key.toString("hex")); // Remove or comment out if not needed
  const iv = crypto.randomBytes(IV_LENGTH);
  // // console.log("IV:", iv.toString("hex")); // Remove or comment out if not needed

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  try {
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    const result = iv.toString("hex") + ":" + encrypted;
    // // console.log("Final encrypted result:", result); // Remove or comment out if not needed

    return result;
  } catch (err) {
    console.error("Encryption error:", err);
    return null;
  }
};

const decryptOTP = (encryptedOTP) => {
  // Ensure the secret key is used correctly for both encryption and decryption

  if (!secretKey) {
    throw new Error("OTP_SECRET_KEY is not set in the environment variables.");
  }

  // AES-256-CBC requires a 32-byte key and 16-byte IV
  const keyBuffer = Buffer.from(secretKey, "utf8");
  let key = crypto
    .createHash("sha256")
    .update(String(secretKey))
    .digest("base64")
    .substr(0, 32);

  // Split the encrypted OTP into IV and encrypted text
  const parts = encryptedOTP.split(":");
  if (parts.length !== 2) {
    throw new Error("Invalid encrypted OTP format.");
  }

  const iv = Buffer.from(parts[0], "hex");
  const encryptedText = Buffer.from(parts[1], "hex");

  // Decrypt using AES-256-CBC
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString("utf8");
};

// signIn function
exports.signIn = async (req, res) => {
  const { body } = req;
  try {
    let user = await User.findOne({ email: body.email }).maxTimeMS(50000);

    const otp = await generateOTP().toString();
    const otpExpires = new Date(Date.now() + 3000000); // OTP expiry time
    const encryptedOtp = encrypt(otp);
    const userName = "there";
    const emailOptions = {
      name: "Ladyish",
      address: "ladyishcrochet@gmail.com",
    };

    if (user) {
      await sendMail(transporter, userName, body.email, emailOptions, otp);

      return res.status(200).json({
        acknowledgement: true,
        message: "OK",
        description: "OTP successfully sent to your email",
        encryptedOtp,
        userIndicator: "old",
      });
    } else {
      try {
        await sendMail(transporter, userName, body.email, emailOptions, otp);
      } catch (error) {
        return res.status(500).json({
          acknowledgement: false,
          message: "Email Send Failed",
          description: error.message,
        });
      }
      return res.status(200).json({
        acknowledgement: true,
        message: "OK",
        description: "OTP successfully sent to your email",
        encryptedOtp,
        userIndicator: "new",
      });
    }
  } catch (error) {
    return res.status(500).json({
      acknowledgement: false,
      message: "Internal Server Error",
      description: error.message,
    });
  }
};

exports.otp = async (req, res) => {
  try {
    // console.log(11);
    const { email, name, phone, otp, encryptedOtp } = req.body;
    // Decrypt the OTP received from the frontend
    const decryptedOTP = decryptOTP(encryptedOtp);
    // console.log(55,decryptedOTP);
    // Validate the decrypted OTP
    if (otp !== decryptedOTP) {
      return res.status(401).json({
        acknowledgement: false,
        message: "Unauthorized",
        description: "Invalid OTP",
      });
    }

    // Check if the user exists
    let user = await User.findOne({ email }).maxTimeMS(30000);

    // If user account is inactive
    if (user && user.status === "inactive") {
      return res.status(401).json({
        acknowledgement: false,
        message: "Unauthorized",
        description: "Your account is in a review state",
      });
    }

    // If user exists, generate access token
    if (user) {
      const accessToken = token({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        status: user.status,
      });

      return res.status(200).json({
        acknowledgement: true,
        message: "OK",
        description: "Login successful",
        accessToken,
        role: user.role,
      });
    }

    // If user doesn't exist, create a new one
    const newUser = new User({ name, email, phone });
    await newUser.save();

    const accessToken = token({
      _id: newUser._id,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role,
      status: newUser.status,
    });

    return res.status(200).json({
      acknowledgement: true,
      message: "OK",
      description: "Login successful",
      accessToken,
      role: newUser.role,
    });
  } catch (error) {
    return res.status(500).json({
      acknowledgement: false,
      message: "Internal Server Error",
      description: error.message,
    });
  }
};

/* reset user password */
exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }, null, {
    maxTimeMS: 50000,
  });

  if (!user) {
    return res.status(404).json({
      acknowledgement: false,
      message: "Not Found",
      description: "User not found",
    });
  } else {
    const hashedPassword = user.encryptedPassword(req.body.password);

    await User.findOneAndUpdate(
      { email: req.body.email },
      { password: hashedPassword },
      { runValidators: false, returnOriginal: false },
      null,
      {
        maxTimeMS: 50000,
      }
    );

    return res.status(200).json({
      acknowledgement: true,
      message: "OK",
      description: "Password reset successful",
    });
  }
};

/* login persistance */
exports.persistLogin = async (req, res) => {
  //// console.log("me call11111 ", req.user, req.body);
  try {
    const user = await User.findById(req.user._id).populate([
      {
        path: "cart",
        populate: [
          { path: "product", populate: ["brand", "category", "store"] },
          "user",
        ],
      },
      {
        path: "reviews",
        populate: ["product", "reviewer"],
      },
      {
        path: "favorites",
        populate: [
          {
            path: "product",
            populate: ["brand", "category", "store"],
          },
          "user",
        ],
      },
      {
        path: "purchases",
        populate: [
          "customer",
          {
            path: "products",
            populate: {
              path: "product",
              populate: ["brand", "category", "store"],
            },
          },
          {
            path: "address", // Ensure this matches exactly with how the model is defined in your Mongoose setup
            populate: { path: "address" }, // Populating address details from the Address model
          },
        ],
      },
      "store",
      "brand",
      "category",
      "products",
    ]);

    if (!user) {
      //// console.log(12365);
      res.status(404).json({
        acknowledgement: false,
        message: "Not Found",
        description: "User not found",
      });
    }

    //// console.log("User details fetched:", user);

    return res.status(200).json({
      acknowledgement: true,
      message: "OK",
      description: "Login successful",
      data: user,
    });
  } catch (error) {
    console.error("Error during persistence login:", error);
    return res.status(500).json({
      acknowledgement: false,
      message: "Internal Server Error",
      description: "An error occurred while fetching the user details",
      error: error.message,
    });
  }
};

/* get all users */
exports.getUsers = async (res) => {
  //// console.log(111);
  const users = await User.find()
    .populate("store")
    .populate(["brand", "category", "store"]);

  return res.status(200).json({
    acknowledgement: true,
    message: "OK",
    description: "Users retrieved successfully",
    data: users,
  });
};

/* get single user */
exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id).populate("store");

  return res.status(200).json({
    acknowledgement: true,
    message: "OK",
    description: `${user.name}'s information retrieved successfully`,
    data: user,
  });
};

exports.getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

/* update user information */
exports.updateUser = async (req, res) => {
  const existingUser = await User.findById(req.user._id);
  const user = req.body;

  if (!req.body.avatar && req.file) {
    await remove(existingUser.avatar?.public_id);

    user.avatar = {
      url: req.file.path,
      public_id: req.file.filename,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(
    existingUser._id,
    { $set: user },
    {
      runValidators: true,
    }
  );

  return res.status(200).json({
    acknowledgement: true,
    message: "OK",
    description: `${updatedUser.name}'s information updated successfully`,
  });
};

/* update user information */
exports.updateUserInfo = async (req, res) => {
  //// console.log(987);
  const existingUser = await User.findById(req.params.id);
  const user = req.body;

  if (!req.body.avatar && req.file) {
    await remove(existingUser.avatar?.public_id);

    user.avatar = {
      url: req.file.path,
      public_id: req.file.filename,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(
    existingUser._id,
    { $set: user },
    {
      runValidators: true,
    }
  );

  return res.status(200).json({
    acknowledgement: true,
    message: "OK",
    description: `${updatedUser.name}'s information updated successfully`,
  });
};

/* delete user information */
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  // remove user avatar
  await remove(user.avatar?.public_id);

  // remove user cart
  if (user.cart.length > 0) {
    user.cart.forEach(async (cart) => {
      await Cart.findByIdAndDelete(cart._id);
    });
  }

  // remove user favorites
  if (user.favorites.length > 0) {
    user.favorites.forEach(async (favorite) => {
      await Favorite.findByIdAndDelete(favorite._id);
    });
  }

  // remove user reviews
  if (user.reviews.length > 0) {
    user.reviews.forEach(async (review) => {
      await Review.findByIdAndDelete(review._id);
    });
  }

  // remove user purchases
  if (user.purchases.length > 0) {
    user.purchases.forEach(async (purchase) => {
      await Purchase.findByIdAndDelete(purchase._id);
    });
  }

  // remove store
  if (user.store) {
    const store = await Store.findByIdAndDelete(user.store);

    // remove store thumbnail
    await remove(store?.thumbnail?.public_id);

    // remove store products
    store.products.forEach(async (prod) => {
      const product = await Product.findByIdAndDelete(prod);

      // remove product thumbnail
      await remove(product?.thumbnail?.public_id);

      // remove product gallery
      product.gallery.forEach(async (gallery) => {
        await remove(gallery?.public_id);
      });

      // remove product reviews
      product.reviews.forEach(async (review) => {
        await Review.findByIdAndDelete(review._id);
      });
    });
  }

  // remove category
  if (user.category) {
    const category = await Category.findByIdAndDelete(user.category);

    // remove category thumbnail
    await remove(category?.thumbnail?.public_id);

    // remove category products
    category.products.forEach(async (prod) => {
      const product = await Product.findByIdAndDelete(prod);

      // remove product thumbnail
      await remove(product?.thumbnail?.public_id);

      // remove product gallery
      product.gallery.forEach(async (gallery) => {
        await remove(gallery?.public_id);
      });

      // remove product reviews
      product.reviews.forEach(async (review) => {
        await Review.findByIdAndDelete(review._id);
      });
    });
  }

  // remove brand
  if (user.brand) {
    const brand = await Brand.findByIdAndDelete(user.brand);

    // remove brand logo
    await remove(brand?.logo?.public_id);

    // remove brand products
    brand.products.forEach(async (prod) => {
      const product = await Product.findByIdAndDelete(prod);

      // remove product thumbnail
      await remove(product?.thumbnail?.public_id);

      // remove product gallery
      product.gallery.forEach(async (gallery) => {
        await remove(gallery?.public_id);
      });

      // remove product reviews
      product.reviews.forEach(async (review) => {
        await Review.findByIdAndDelete(review._id);
      });
    });
  }

  // remove user from product's buyers array
  if (user.products.length > 0) {
    await Product.updateMany(
      {},
      {
        $pull: {
          buyers: user._id,
        },
      }
    );
  }

  return res.status(200).json({
    acknowledgement: true,
    message: "OK",
    description: `${user.name}'s information deleted successfully`,
  });
};

// seller request & approve
exports.getSellers = async (res) => {
  const users = await User.find({
    role: "seller",
    status: "inactive",
  }).populate(["brand", "category", "store"]);

  return res.status(200).json({
    acknowledgement: true,
    message: "OK",
    description: "Sellers retrieved successfully",
    data: users,
  });
};

exports.reviewSeller = async (req, res) => {
  await User.findByIdAndUpdate(req.query.id, {
    $set: req.body,
  });

  return res.status(200).json({
    acknowledgement: true,
    message: "OK",
    description: "Seller reviewed successfully",
  });
};



