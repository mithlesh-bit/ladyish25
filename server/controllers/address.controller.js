const mongoose = require("mongoose");
const Address = require("../models/address.model"); // Ensure you import your models correctly
const User = require("../models/user.model"); // Ensure you import your models correctly

exports.addAddress = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming userID is correctly populated from authentication middleware

    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Construct the address from request body
    const addressData = {
      ...req.body,
      user: userId, // Optionally link user directly in address for easier lookup
    };

    // Create the new address

    const newAddress = new Address(addressData);
    await newAddress.save();

    // Update the user's address list
    user.addresses.push(newAddress._id);
    await user.save();

    // Send success response with the new address data
    res.status(201).json({
      success: true,
      data: newAddress,
    });
  } catch (error) {
    console.error("Add Address Error:", error); // Better error logging
    res.status(400).json({
      success: false,
      message: "Failed to add address: " + error.message,
    });
  }
};

exports.getAdressDetails = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json(address);
  } catch (error) {
    console.error("Server Error", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getUserAddresses = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate({
      path: "addresses",
      match: { status: true },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const activeAddresses = user.addresses.reverse();
    res.json(activeAddresses);
  } catch (error) {
    console.error("Server Error", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Log the incoming ID for debugging purposes

    // Attempt to update the address document status to false
    const updateAddress = await Address.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    );

    if (!updateAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Log the successful status update

    // Optionally find users that have this address and log them
    const affectedUsers = await User.find({ addresses: id });

    res.json({ message: "Address status updated to inactive successfully" });
  } catch (error) {
    console.error("Error during address status update:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};