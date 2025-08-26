const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/nextPage", async (req, res) => {
  console.log("je suis sur la route next (GET)");

  try {
    // Votre logique ici
  } catch (error) {
    console.log("error in catch:", error);
  }
});

module.exports = router;
