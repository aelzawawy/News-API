const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Reporter",
  },
  reporterName: {
    type: String,
    required: true,
    ref: "Reporter",
  },
  image: {
    type: Buffer,
  },
});

const News = mongoose.model("News", newsSchema);
module.exports = News;
