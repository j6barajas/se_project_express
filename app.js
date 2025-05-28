const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const { login, createUser } = require("./controllers/users");
const { NOT_FOUND_ERROR_CODE } = require("./utils/errors");
const auth = require("./middlewares/auth");
const cors = require("cors");

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err.message);
    console.log("Full error:", err);
  });

app.use(cors());

app.use(express.json());

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/", auth, mainRouter);

app.use((req, res) => {
  res
    .status(NOT_FOUND_ERROR_CODE)
    .send({ message: "Requested resource not found" });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001.");
});
