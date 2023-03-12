const express = require("express");
const app = express();
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
require("dotenv").config();

const userSchema = require("./model/userModel.js");
const configure_passport = require("./config/passport_config");
const db_connect = require("./config/db_connect");

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.session());
app.use(passport.initialize());

app.set("view engine", "ejs");
app.use(flash());

configure_passport(passport);

db_connect();

app.get("/getete", (req, res) => {
  console.log(req.body);
  res.send(req.body)
});

app.get("/register", (req, res) => {
  res.render("register", {
    topicHead: "Register Form",
  });
});

app.post("/register", async (req, res) => {
  try {
    const { email, name, password } = req.body;
    if (email === "" || name === "" || password === "")
      return res.status(400).send("Empty fields deducted!");
    const userData = new userSchema({
      email,
      name,
      password,
    });
    await userData.save();
    res.status(200).send(`${userData.name} successully registered.`);
  } catch (error) {
    console.log(error);
  }
});

app.get("/login", (req, res) => {
  res.render("login", {
    topicHead: "Login page",
  });
});

app.post(
  "/loginPage",
  passport.authenticate("local", {
    failureRedirect: "register",
    badRequestMessage: "Bad request",
    failureFlash: true,
  }),
  (req, res) => {
    res.send(`Logged in ${req.user.name}`);
  }
);

app.listen(process.env.PORT, (err) => {
  if (err) return console.log(`Error while starting the server: ${err}`);
  console.log(`Server running on port ${process.env.PORT}`);
});
