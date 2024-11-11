const mongoose = require("mongoose");
const connectDB = () => {
  mongoose.connect(process.env.URLDB).then((res) => {
    console.log("DataBase Connected Successfully " + res.connection.host);
  });
};

module.exports = connectDB;
