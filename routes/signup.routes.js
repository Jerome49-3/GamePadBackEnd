const express = require("express");
const router = express.Router();
const User = require("../models/User");
const uid2 = require("uid2");
const { SHA256 } = require("crypto-js");
const encBase64 = require("crypto-js/enc-base64");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const convertToBase64 = require("../utils/convertToBase64");

router.post("/signup", fileUpload(), async (req, res) => {
  // return res.status(200).json({ message: "je suis sur la route /signup" });
  const { password, username, confirmPassword, email } = req.body;
  // console.log(
  //   "password:",
  //   password,
  //   "\n",
  //   "username:",
  //   username,
  //   "\n",
  //   "confirmPassword:",
  //   confirmPassword,
  //   "\n",
  //   "email:",
  //   email
  // );
  if (password !== undefined && email !== undefined) {
    const userExist = await User.findOne({ email: email });
    // console.log("userExist", userExist);
    if (userExist) {
      return res.status(400).json({ message: "bad request" });
    } else {
      if (password !== confirmPassword) {
        return res
          .status(400)
          .json({ message: "les mots de passe ne correspondent pas" });
      } else {
        try {
          const salt = uid2(24);
          // console.log("salt:", salt);
          const hash = SHA256(password + salt).toString(encBase64);
          // console.log("hash:", hash);
          const token = uid2(64);
          // console.log("token:", token);
          if ((hash && token !== null) || (hash && token !== undefined)) {
            const newUser = new User({
              email: email,
              account: {
                username: username,
              },
              token: token,
              hash: hash,
              salt: salt,
            });
            try {
              //**** verifier la précense de req.files.pîctures ****//
              // console.log("req.files.pictures before if:", "\n", req.files);
              //**** si req.files.pîctures est différent de null ou de 0 ****//
              if (req.files !== null || req.files.pictures !== 0) {
                //**** stocker req.files.pîctures ds une variable ****//
                const pictureToUpload = req.files.pictures;
                // console.log("pictureToUpload:", pictureToUpload);
                //**** stocker la vérification de pictureToUpload dans une variable const 'arrayPictures' pour savoir si c'est un tableau ****//
                const arrayPictures = Array.isArray(pictureToUpload);
                // console.log("arrayPictures:", arrayPictures);
                //**** si 'arrayPictures' n'est pas un tableau ****//
                if (arrayPictures === false) {
                  //**** on convertit le buffer (données en language binaire, temporaire pour être utilisé) de l'image en base64 pour etre compris par cloudinary ****//
                  const result = await cloudinary.uploader.upload(
                    convertToBase64(pictureToUpload),
                    {
                      folder: "gamePad/avatar/" + newUser._id,
                    }
                  );
                  // console.log("resultnotPromise:", result);
                  //**** je stocke les données de la conversion en base64 du buffer de l'image dans req ****//
                  req.uploadOneFile = result;
                  // console.log("req.uploadOneFile:", req.uploadOneFile);
                  //**** si arrayPictures est un tableau ****//
                }
              }
              //**** si req.files.pîctures est null ou 0, on retourne une erreur 400 bad request ****//
              else {
                return res.status(400).json({ result, message: "bad request" });
              }
            } catch (error) {
              //**** si le try echoue (erreur server), on retourne une erreur ****//
              console.log("error.message:", "\n", error.message);
            }
            // console.log("newUser before save:", newUser);
            newUser.account.avatar = req.uploadOneFile;
            await newUser.save();
            // console.log("newUser after save:", newUser);
            return res.status(201).json(newUser);
          }
        } catch (error) {
          console.log("error", error);
        }
      }
    }
  }
});

module.exports = router;
