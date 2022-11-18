const mongoose = require("mongoose");

const sauceSchema = new mongoose.Schema({
    userId: String,
    name: String,
    manufacturer: String,
    description: String,
    mainPepper: String,
    imageUrl: String,
    heat: { type: Number, min: 1, max: 5 },
    likes: Number,
    dislikes: Number,
    usersLiked: [String],
    usersDisliked: [String],
});

module.exports = mongoose.model('Sauce', sauceSchema);