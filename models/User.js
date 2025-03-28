const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    type: String,
    required: true,
  },
  account: {
    username: {
      type: String,
    },
    avatar: {
      type: Object,
      // default:
      //   "https://asset.cloudinary.com/djk45mwhr/16e96edde6d78396188a2000bb61738e",
    },
  },
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
