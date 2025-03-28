const mongoose = require("mongoose");

const Review = mongoose.model("Review", {
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  gameId: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
  },
  counter: {
    type: Number,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Review;
