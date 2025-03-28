require("dotenv").config();
const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const mongoose = require("mongoose");
const User = require("../models/User");
const fileUpload = require("express-fileupload");
const isAuthenticated = require("../middleware/isAuthenticated");

router.post("/review", isAuthenticated, fileUpload(), async (req, res) => {
  // return res.status(200).json({ message: "je suis sur la route /review" });
  const { title, content, gameId, dateReview } = req.body;
  // console.log(
  //   "title:",
  //   title,
  //   "\n",
  //   "content:",
  //   content,
  //   "\n",
  //   "gameId:",
  //   gameId,
  //   "\n",
  //   "dateReview:",
  //   dateReview
  // );
  // console.log(typeof gameId);
  if (title !== undefined && content !== undefined) {
    try {
      // const titleExist = await Review.findOne({ title: title });
      // if (titleExist) {
      //   // console.log("titleExist:", titleExist);
      //   return res.status(400).json({ message: "Title already exists" });
      // } else {
      const newReview = new Review({
        title: title,
        content: content,
        gameId: gameId,
        date: dateReview,
        owner: req.user,
      });
      // console.log("newReview before save:", newReview);
      await newReview.save();
      // console.log("newReview after save:", newReview);
      return res.status(201).json(newReview);
    } catch (error) {
      console.log(error.message);
    }
  }
});

router.get("/review/:id", async (req, res) => {
  let userFind = {};
  let reviews = [];
  const idReview = req.params.id;
  // console.log("idReview:", idReview);
  const review = await Review.find({ gameId: idReview });

  // console.log("review:", review);
  if (review.length === 0) {
    // console.log("review:", review);
    return res.status(200).json({
      reviews: [
        {
          message: "no review for this game",
        },
      ],
    });
  } else {
    for (let i = 0; i < review.length; i++) {
      const reviewOne = review[i];
      // console.log("reviewOne:", reviewOne);
      //je crée une constante du propriétaire du commentaire
      const ownerId = reviewOne.owner;
      // console.log("ownerId:", ownerId);
      //je recherche les infos du propriétaire du commentaire;
      userFind = await User.findOne(ownerId).select("account");
      // console.log("userFind:", userFind);
      //je vérifie qu'ownerId et l'idUser soit valide;
      const ownerIdIsValid = mongoose.isValidObjectId(ownerId);
      const userFindId = mongoose.isValidObjectId(userFind._id);
      // console.log("ownerIdIsValid:", ownerIdIsValid);
      // console.log("userFindId:", userFindId);
      //je vérifie le retour de l'user trouvé
      // console.log("userFind:", userFind);
      // console.log("reviewOne:", reviewOne);
      // console.log(
      //   "reviewOne.owner:",
      //   reviewOne.owner,
      //   "\n",
      //   "userFind._id",
      //   userFind._id
      // );
      // if (reviewOne.owner === userFind._id) {
      //if condition not working ?? but value of reviewOne.owner === value of userFind._id
      // console.log(
      //   "reviewOne.owner:",
      //   reviewOne.owner,
      //   "\n",
      //   "userFind._id:",
      //   userFind._id
      // );
      reviews.push(reviewOne);
      // console.log("reviews in if:", reviews);
      // }
    }
    return res.status(201).json({
      reviews,
      user: userFind.account,
    });
  }
});

router.post("/review/:id", async (req, res) => {
  // return res.status(200).json({ message: "je suis sur la route /review/:id" });
  const idCounter = req.params.id;
  console.log("idCounter:", idCounter);
  const count = req.body.counter;
  console.log("count:", count);
  try {
    const reviews = await Review.findByIdAndUpdate(
      idCounter,
      { counter: count },
      { new: true }
    );
    console.log("review:", reviews);
    res.status(200).json({ reviews });
  } catch (error) {
    console.log("error:", error);
  }
});

module.exports = router;
