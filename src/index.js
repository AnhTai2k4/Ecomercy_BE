const express = require("express");
const dotenv = require("dotenv");
const mongoose = require('mongoose')
const routes= require('./routes')
const bodyParser = require('body-parser')

dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(bodyParser.json())
routes(app)


app.get("/", (req, res) => {
  res.send("iu iu iu");
});

mongoose
  .connect(
    process.env.MONGO_DB
  )
  .then(() => {
    console.log("Connect Successful");
  })
  .catch((err) => {
    console.log("Loi: ", err);
  });
app.listen(port, () => {
  console.log("dang nghe ne", port);
  console.log("env ne", process.env.PORT);
});
