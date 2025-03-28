require("dotenv").config();
const axios = require("axios");
const express = require("express");
const router = express.Router();

router.get("/game/:id", async (req, res) => {
  // return res.status(200).json({ message: "je suis sur la route /game" });
  const id = req.params.id || "";
  // console.log("id on game/:id", id);
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/games/${id}?key=${process.env.API_KEY}`
    );
    if (response) {
      // console.log("response:", response);
      const released = response.data.released;
      // console.log("released:", released);
      const newDate = new Date(released).toDateString() || "0000-00-00";
      // console.log("newDate:", newDate);
      // console.log("typeof released:", typeof released);
      const day = newDate.slice(8, 10);
      // console.log("day:", day);
      const month = newDate.slice(4, 7);
      // console.log("month:", month);
      const year = newDate.slice(11, 15);
      // console.log("year:", year);
      let releasedDate = month + " " + day + "," + " " + year;
      // console.log("releasedDate:", releasedDate);
      // console.log("response.data on /game/:id:", response.data);
      return res.status(200).json({ game: response.data, date: releasedDate });
    }
  } catch (error) {
    console.log("error.response on game/:id:", error.response);
  }
});

module.exports = router;
