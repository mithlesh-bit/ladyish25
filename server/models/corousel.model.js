const mongoose = require("mongoose");

const corouselSchema = new mongoose.Schema({
  title: String,
  image: String,
  link: String,

});

module.exports = mongoose.model("corousel", corouselSchema);
