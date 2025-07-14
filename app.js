require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { login, createUser } = require("./controllers/users");
const { NOT_FOUND_ERROR_CODE } = require("./utils/errors");
const errorHandler = require("./middlewares/error-handler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

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

app.use(requestLogger);

app.post("/signin", login);
app.post("/signup", createUser);

app.use("/", mainRouter);

app.use(errorLogger);

app.use((req, res) => {
  res
    .status(NOT_FOUND_ERROR_CODE)
    .send({ message: "Requested resource not found" });
});

app.use(errors());

app.use(errorHandler);

app.listen(3001, () => {
  console.log("Server is running on port 3001.");
});
