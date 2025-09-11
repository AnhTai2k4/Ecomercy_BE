const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const cors = require("cors");

dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true, // cho phép gửi cookie
  })
);
routes(app);

app.get("/", (req, res) => {
  res.send("iu iu iu");
});

mongoose
  .connect(process.env.MONGO_DB, {
    serverSelectionTimeoutMS: 5000, // 5s
  })
  .then(() => {
    console.log("Connect Successful");
  })
  .catch((err) => {
    console.log("Loi: ", err);
  });
app.listen(port, () => {
  console.log("env ne", process.env.PORT);
});
