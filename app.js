require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { login, createUser } = require("./controllers/users");
const { NOT_FOUND_ERROR_CODE } = require("./utils/errors");
const NotFoundError = require("./errors/not-found-err");
const errorHandler = require("./middlewares/error-handler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const {
  validateClothingItemBody,
  validateUserInfoBody,
  authenticateUserLogIn,
  validateIds,
  validateURL,
} = require("./middlewares/validation");

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

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.post("/signin", authenticateUserLogIn, login);
app.post("/signup", validateUserInfoBody, createUser);

app.use("/", mainRouter);

app.use(errorLogger);

app.use((req, res) => {
  return next(new NotFoundError("Requested resource not found."));
});

app.use(errors());

app.use(errorHandler);

app.listen(3001, () => {
  console.log("Server is running on port 3001.");
});
