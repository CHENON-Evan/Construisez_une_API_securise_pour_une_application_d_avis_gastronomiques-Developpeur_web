const express = require("express");
const {
    getSauces,
    createSauce,
    getSauceById,
    deleteSauce,
    modifySauce,
    likeSauce
  } = require("../controllers/sauces")
const { authenticateUser } = require('../middleware/auth')
const { upload } = require("../middleware/multer")
const Router = express.Router();
const bodyParser = require("body-parser")

Router.use(bodyParser.json())

Router.get("/", authenticateUser, getSauces )
Router.post("/", authenticateUser, upload.single("image"), createSauce)
Router.get("/:id", authenticateUser, getSauceById)
Router.delete("/:id", authenticateUser, deleteSauce)
Router.put("/:id", authenticateUser, upload.single("image"), modifySauce)
Router.post("/:id/like",authenticateUser , likeSauce)

module.exports = Router 