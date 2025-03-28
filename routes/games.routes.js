require("dotenv").config();
const axios = require("axios");
const express = require("express");
const router = express.Router();

router.get("/games", async (req, res) => {
  let search = req.query.search || "";
  // console.log("search:", search);
  let search_exact = req.query.search_exact || "";
  // console.log("search_exact:", search_exact);
  let dates = req.query.dates || "";
  // console.log("dates on /games:", dates);
  let page = req.query.page || "";
  // console.log("page:", page);
  if (page <= 0) {
    page = 1;
  }
  // console.log("page after if:", page);
  // let ordering = req.query.ordering || "";
  // console.log("ordering:", ordering);
  if (search.length > 0) {
    // ordering = "";
    dates = "";
    if (page <= 0) {
      page = req.query.page || 1;
    }
  } else if (search.length === 0) {
    search = "";
  }
  // console.log("search.length:", search.length);
  // const limit = req.query.limit || 100;
  // const skip = req.query.skip || 0;
  // return res.status(200).json({ message: "je suis sur la route /games" });
  try {
    // console.log("dates in try on /games:", dates);
    const response = await axios.get(
      `https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=${page}&dates=${dates}&search=${search}&search_exact=${search_exact}`
    );
    // const response = await axios.get(
    //   `https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=${page}&ordering=${ordering}&dates=${dates}&search=${search}`
    // );
    if (response) {
      return res.status(200).json(response.data);
    }
  } catch (error) {
    console.log("error on /games:", error.response);
  }
});

router.get("/games/:id/game-series", async (req, res) => {
  const id = req.params.id || "";
  // console.log("id on /games/:id/game-series:", id);
  // return res.status(200).json({ message: "je suis sur la route /games/:id/game-series" });
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/games/${id}/game-series?key=${process.env.API_KEY}`
    );
    if (response) {
      if (response.data.count !== 0) {
        // console.log("response.data on /games/:id/game-series:", response.data);
        return res.status(200).json(response.data);
      } else {
        return res.status(200).json({
          results: {
            message: "No games likes this game",
          },
        });
      }
    }
  } catch (error) {
    console.log("error on /games/:id/game-series:", error.response);
  }
});

module.exports = router;
