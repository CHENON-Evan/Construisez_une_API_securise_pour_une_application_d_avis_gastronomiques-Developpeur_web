const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/users')
const saucesRoutes = require('./routes/sauces')
const path = require('path')
const dotenv = require('dotenv')

// Configure the environment variables
dotenv.config({
  path: path.resolve(__dirname, '.env')
});


// MiddLeware
app.use(cors());
app.use(express.json());
app.use(express.static('public'))
app.use('/images', express.static(path.join(__dirname, 'images')))

//Database
const mongoose = require("mongoose");
const  Router  = require('express');

const password = process.env.DB_PASSWORD
const username = process.env.DB_USER
const db = process.env.DB_NAME
const uri = `mongodb+srv://${username}:${password}@cluster0.o1xlh9m.mongodb.net/${db}?retryWrites=true&w=majority`
mongoose.connect(uri).then(() => console.log("Connected to Mongo!")).catch((err) => console.error("Error connecting to Mongo: ", err))


// Routes
app.use("/api/auth", userRoutes)
app.use("/api/sauces", saucesRoutes)

module.exports =  app
