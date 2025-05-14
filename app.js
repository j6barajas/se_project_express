const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: "681d3f3e8dda8cc2818a4164",
  };
  next();
});
app.use("/", mainRouter);
app.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001.");
});
