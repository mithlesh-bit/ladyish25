const express = require("express");
const cloudinary = require("../cloudinary"); // Ensure this path is correct
const corouselSchema = require("../models/corousel.model");



const NodeCache = require("node-cache");
const dataCache = new NodeCache({ stdTTL: 60, checkperiod: 120 }); // Cache for 60 seconds

exports.corouselController = async (req, res) => {
  try {
    const { title, link } = req.body;

    // Check for file in the request
    if (req.file) {
      // Use Cloudinary to upload the file
      cloudinary.uploader.upload(req.file.path, async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error uploading image");
        }

        try {
          const corouselDesign = new corouselSchema({
            title,

            link,
            image: result.secure_url,
          });

          const contact = await corouselDesign.save();
          return res.status(200).json({
            success: true,
            message: "Corousel Updated Successfully",
            contact,
          });
        } catch (error) {
          console.error(error);
          return res
            .status(500)
            .send("An error occurred while saving to database");
        }
      });
    } else {
      // Handle case where no file is uploaded
      return res.status(400).send("No image file provided.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("An unexpected error occurred");
  }
};

exports.getAllData = async (req, res) => {
  try {
    // Check if data is cached
    const cachedData = dataCache.get("carouselData");

    if (cachedData) {
      return res.json(cachedData); // Serve cached data
    }

    // If not cached, fetch data from the database
    const data = await corouselSchema.find({}, {}, { maxTimeMS: 30000 });

    // Reverse the data and cache it
    const reversedData = data.reverse();
    dataCache.set("carouselData", reversedData); // Cache the data

    return res.json(reversedData); // Return the data
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteCorousel = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteCorousel = await corouselSchema.findByIdAndDelete(id);
    if (!deleteCorousel) {
      return res.status(404).json({ message: "Corousel not found" });
    }
    res.json({ message: "Corousel deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
