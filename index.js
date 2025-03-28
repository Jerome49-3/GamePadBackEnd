require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(cors());
app.use(express.json());

//import routes:
const login = require("./routes/login.routes");
const signup = require("./routes/signup.routes");
const games = require("./routes/games.routes");
const game = require("./routes/game.routes");
const review = require("./routes/review.routes");

app.use("/user", login);
app.use("/user", signup);
app.use(games);
app.use(game);
app.use(review);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "welcome to my projects GamePad" });
});

app.all("*", (req, res) => {
  console.log("All routes");
});

app.listen(process.env.PORT, (req, res) => {
  console.log("server on");
});
