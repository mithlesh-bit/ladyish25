

/* external imports */
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const validator = require("validator");

/* create store schema */
const tempUser = new mongoose.Schema(
  {
    // for title
    name: {
      type: String,
      required: [true, "Please, provide your full name"],
      trim: true,
      maxLength: [100, "Your name would be at most 100 characters"],
    },

    // for email
    email: {
      type: String,
      required: [true, "Please, provide your email address"],
      validate: [validator.isEmail, "Provide a valid email address"],
      unique: [true, "Email already exist. Please, provide new"],
    },

    // for password
    // password: {
    //   type: String,
    //   required: [true, "Please, provide a strong password"],
    //   validate: {
    //     validator: (value) =>
    //       validator.isStrongPassword(value, {
    //         minUppercase: 1,
    //         minLowercase: 1,
    //         minNumbers: 1,
    //         minSymbols: 1,
    //       }),
    //     message:
    //       "Password {VALUE} should contain minimum 1 => uppercase, lowercase, number and symbol",
    //   },
    //   minLength: [8, "Password should be at least 8 characters"],
    //   maxLength: [20, "Password should be at most 20 characters"],
    // },

    // for avatar
    avatar: {
      url: {
        type: String,
        validate: [validator.isURL, "Please provide a valid avatar URL"],
        default: "https://placehold.co/300x300.png",
      },
      public_id: {
        type: String,
        default: "N/A",
      },
    },

    // for contact number
    phone: {
      type: String,
      required: [
        true,
        "Please, provide your phone number, i.e.: +91xxxxxxxxxx",
      ],
      validate: {
        validator: (value) =>
          validator.isMobilePhone(value, "en-IN", { strictMode: false }),
        message:
          "Phone number {VALUE} is not valid. Please, retry like +91xxxxxxxxxx",
      },
      unique: true,
    },

    otp: {
      type: String,
    },

    // for role
    role: {
      type: String,
      enum: ["admin", "buyer", "seller"],
      default: "buyer",
    },

    // for account status
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    // for cart
    cart: [
      {
        type: ObjectId,
        ref: "Cart",
      },
    ],

    // for wishlist
    favorites: [
      {
        type: ObjectId,
        ref: "Favorite",
      },
    ],

    // for reviews
    reviews: [
      {
        type: ObjectId,
        ref: "Review",
      },
    ],

    // for purchases
    purchases: [
      {
        type: ObjectId,
        ref: "Purchase",
      },
    ],

    // for store creation
    store: {
      type: ObjectId,
      ref: "Store",
    },

    // for brand creation
    brand: {
      type: ObjectId,
      ref: "Brand",
    },

    // for category creation
    category: {
      type: ObjectId,
      ref: "Category",
    },

    // for buying products
    products: [
      {
        type: ObjectId,
        ref: "Product",
      },
    ],

    // for address
    // address: {
    //   type: String,
    //   default: "N/A",
    //   trim: true,
    //   maxLength: [500, "Your address would be at most 500 characters"],
    // },

    addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "address" }],

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
/* create store schema model */
const tempUsers = mongoose.model("tempUser", tempUser);

/* export store schema */
module.exports = tempUsers;
