const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/previousPage", async (req, res) => {
  console.log("je suis sur la route previous (GET)");

  try {
    // Votre logique ici
  } catch (error) {
    console.log("error in catch:", error);
  }
});

module.exports = router;
