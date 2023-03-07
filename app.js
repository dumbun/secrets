require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//// Mongoose

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

///// get & post requests

app.get("/", (req, res) => {
    res.render("home");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password,
    });
    newUser.save((err) => {
        if (err) {
            console.error(err);
        } else {
            res.render("secrets")
        }
    })
});

app.post("/login", (req, res) => {
    const email = req.body.username
    const password = req.body.password

    User.findOne({ email: email }, function (err, foundUser) {
        if (err) {
            console.error(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render('secrets')
                } else {
                    res.send("password is Incorrect")
                }
            }
        }
    })
})

//// app listening

app.listen(3000, () => {
    console.log("✅ server started on port 3000");
});
