require("dotenv").config();
const mongoose = require("mongoose");

module.exports = db_connect = () => {
  mongoose
    .connect(process.env.DB_CONNECT_URL)
    .then(() => {
      console.log("DB connected successfully");
    })
    .catch((e) => {
      console.log(`Error occured while connecting DB: ${e}`);
    });
};
