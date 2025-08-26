require("dotenv").config();
const axios = require("axios");
const express = require("express");
const router = express.Router();

router.get("/games", async (req, res) => {
  let { search, search_exact, page, platforms, genres, ordering } = req?.query;
  console.log("req.query:", req?.query);
  console.log(
    "search:",
    "\n",
    "search_exact:",
    "\n",
    "page:",
    "\n",
    "platforms:",
    "\n",
    "genres:",
    "\n",
    "ordering:",
    "\n",
    search,
    search_exact,
    page,
    platforms,
    genres,
    ordering
  );

  search = req.query.search || "";
  // console.log("search:", search);
  search_exact = req.query.search_exact || "";
  // console.log("search_exact:", search_exact);
  dates = req.query.dates || "";
  // console.log("dates on /games:", dates);
  page = req.query.page || "";
  // console.log("page:", page);
  platforms = req?.query?.platforms || "";

  genres = req?.query?.genres || "";

  ordering = req?.query?.ordering || "";

  if (page <= 0) {
    page = 1;
  }

  if (req?.query?.platforms === "All") {
    platforms === "";
  }

  if (req?.query?.genres === "All") {
    genres === "";
  }
  if (req?.query?.ordering === "Default") {
    ordering === "";
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
  try {
    // console.log("dates in try on /games:", dates);
    const response = await axios.get(
      `https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=${page}&dates=${dates}&search=${search}&search_exact=${search_exact}`
    );
    //     const response = await axios.get(
    //   `https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=${page}&dates=${dates}&search=${search}&search_exact=${search_exact}&platforms=${platforms}&genres=${genres}&ordering=${ordering}`
    // );
    console.log(
      "%Response.count on games: ",
      "color: red",
      response?.data?.count
    );
    console.log(
      "%Response.results on games: ",
      "color: red",
      response?.data?.results
    );

    // const response = await axios.get(
    //   `https://api.rawg.io/api/games?key=${process.env.API_KEY}&page=${page}&ordering=${ordering}&dates=${dates}&search=${search}`
    // );
    if (response) {
      return res.status(200).json(response?.data);
    }
  } catch (error) {
    console.group("Error on /games:", error);
    console.log("Error.response.status:", error?.response?.status);
    console.log("Error.response.statusText:", error?.response?.statusText);
    console.log("error.response.data:", error?.response?.data);
    console.groupEnd();
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
