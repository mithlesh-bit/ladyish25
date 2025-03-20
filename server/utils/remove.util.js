/**
 * Title: Write a program using JavaScript on Remove Util

 * Date: 13, November 2023
 */

/* external import */
const cloudinary = require("cloudinary");

/* remove image from cloudinary */
async function remove(public_id) {
  await cloudinary.uploader.destroy(public_id);
}

module.exports = remove;
