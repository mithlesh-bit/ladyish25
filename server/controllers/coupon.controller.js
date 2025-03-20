const mongoose = require("mongoose");
const Coupon = require("../models/coupon.model"); // Ensure you import your models correctly


// Add a new coupon
exports.addCoupon = async (req, res) => {
  try {
    const { codeName, discountPercentage, minimumCartValue, validity, category } = req.body;
    const newCoupon = new Coupon({ codeName, discountPercentage, minimumCartValue, validity, category });
    await newCoupon.save();
    res.status(201).json(newCoupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Validate a coupon code
exports.validateCoupon = async (req, res) => {
  try {
    const { codeName, cartValue, category } = req.body;

    // Validate cartValue is a number
    if (typeof cartValue !== "number" || isNaN(cartValue)) {
      return res.status(400).json({ message: "Invalid cart value" });
    }

    // Find the coupon by code name
    const coupon = await Coupon.findOne({ codeName });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    if (cartValue < coupon.minimumCartValue) {
      return res.status(400).json({
        message: `Minimum cart value for this coupon is : ₹${coupon.minimumCartValue}`,
      });
    }

    // Ensure the coupon has a valid discount percentage
    if (
      typeof coupon.discountPercentage !== "number" ||
      isNaN(coupon.discountPercentage)
    ) {
      return res
        .status(500)
        .json({ message: "Invalid discount percentage in coupon" });
    }

    // Optional: Check if the category matches
    // if (!category || category.toLowerCase() !== coupon.category.toLowerCase()) {
    //   return res.status(400).json({ message: "Coupon is not valid in this category" });
    // }

    // Ensure cart value meets the minimum requirement for the coupon

    // Check if the coupon is still valid
    if (new Date() > coupon.validity) {
      const validityDate = new Date(coupon.validity);
      const formattedDate = `${validityDate
        .getDate()
        .toString()
        .padStart(2, "0")}/${(validityDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${validityDate.getFullYear()}`;

      return res
        .status(400)

        .json({
          message: `Coupon has expired on ${formattedDate}`,
        });
    }

    // Calculate the discount amount
    const discountAmount = (cartValue * coupon.discountPercentage) / 100;

    // Return the discounted amount and success status
    res.json({
      valid: true,
      discount: discountAmount.toFixed(2), // Ensure the discount amount is rounded to 2 decimal places
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteCorousel = await Coupon.findByIdAndDelete(id);
    if (!deleteCorousel) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.json({ message: "Coupon deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
