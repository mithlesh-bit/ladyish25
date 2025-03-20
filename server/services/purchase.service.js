const axios = require("axios");
const nodemailer = require("nodemailer");
const Purchase = require("../models/purchase.model");
const User = require("../models/user.model");

let productsHtml;
// get all purchases
async function getAllPurchases(res) {
  const purchases = await Purchase.find({}, null, {
    maxTimeMS: 50000,
  }).populate(["customer", "products.product"]);

  const reversedPurchases = purchases.reverse();

  res.status(200).json({
    acknowledgement: true,
    message: "Ok",
    description: "Purchases fetched successfully",
    data: reversedPurchases,
  });
}





async function updatePurchaseStatus(id, status) {
  try {

    const result = await Purchase.findByIdAndUpdate(
      id,
      { $set: { status: status } },
      { new: true, runValidators: true } // Return the updated document and ensure validations are applied
    );

    if (!result) {

      throw new Error("Purchase not found");
    }

    const response = {
      acknowledgement: true,
      message: "Purchase status updated successfully",
      data: result,
    };

    return response;
  } catch (error) {
    console.error("Error updating purchase status:", error.message);

    // Return error response
    return {
      acknowledgement: false,
      message: "Failed to update purchase status",
      error: error.message,
    };
  }
}



module.exports = {
  getAllPurchases,
  updatePurchaseStatus,
};


