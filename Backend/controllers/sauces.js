const Sauce = require('../models/sauces');
const { unlink } = require("fs/promises")
const {likeSauce} = require("./vote");

function getSauces(req, res) {
  Sauce.find({})
  .then((sauces) => res.send(sauces))
  .catch((error) => res.status(500).send( error ))
}

function getSauce(req, res) {
  const { id } = req.params
  return Sauce.findById(id)
}

function getSauceById(req, res) {
  getSauce(req, res)
    .then((product) => sendClientResponse(product, res))
    .catch((err) => res.status(500).send(err))
}

function deleteSauce(req, res) {
  const { id } = req.params
  Sauce.findByIdAndDelete(id)
    .then((product) => sendClientResponse(product, res))
    .then((item) => deleteImage(item))
    .then((res) => console.log("FILE DELETED", res))
    .catch((err) => res.status(500).send({ message: err }))
}

function modifySauce(req, res) {
  const {
    params: { id }
  } = req

  const hasNewImage = req.file != null
  const payload = makePayload(hasNewImage, req)

  if (req.currentUser._id.toString() !== payload.userId){
  return res.status(403).json({ error: 'Utilisateur non trouvé !' });
  }

  Sauce.findByIdAndUpdate(id, payload)
    .then((dbResponse) => sendClientResponse(dbResponse, res))
    .then((product) => deleteImage(product))
    .then((res) => console.log("FILE DELETED", res))
    .catch((err) => console.error("PROBLEM UPDATING", err))
}

function deleteImage(product) {
  if (product == null) return
  console.log("DELETE IMAGE", product)
  const imageToDelete = product.imageUrl.split("/").at(-1)
  return unlink("images/" + imageToDelete)
}

function makePayload(hasNewImage, req) {
  console.log("hasNewImage:", hasNewImage)
  if (!hasNewImage) return req.body
  const payload = JSON.parse(req.body.sauce)
  payload.imageUrl = makeImageUrl(req, req.file.fileName)
  console.log("NEW IMAGE TO MANAGE")
  console.log("here is the payload:", payload)
  return payload
}

function sendClientResponse(product, res) {
  if (product == null) {
    console.log("NOTHING TO UPDATE")
    return res.status(404).send({ message: "Object not found in database" })
  }
  console.log("ALL GOOD, UPDATING:", product)
  return Promise.resolve(res.status(200).send(product)).then(() => product)
}

function makeImageUrl(req, fileName) {
  return req.protocol + "://" + req.get("host") + "/images/" + fileName
}

function createSauce(req, res) {
  const { body, file } = req
  const { fileName } = file
  const sauce = JSON.parse(body.sauce);
  const { name, manufacturer, description, mainPepper, heat, userId } = sauce;

  const product = new Sauce({
    userId: userId,
    name: name,
    manufacturer: manufacturer,
    description: description,
    mainPepper: mainPepper,
    imageUrl: makeImageUrl(req, fileName),
    heat: heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  product
    .save()
    .then((message) => res.status(201).send({ message }))
    .catch((err) => res.status(500).send(err));
}

module.exports = { sendClientResponse, getSauce, getSauces, createSauce, getSauceById, deleteSauce, modifySauce, likeSauce }



