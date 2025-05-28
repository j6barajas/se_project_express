const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const {
  BAD_REQUEST_ERROR_CODE,
  SERVER_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  CONFLICT_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, avatar, email, password: hash });
    const { password: pwd, ...userWithoutPassword } = user.toObject();
    res.status(201).send(userWithoutPassword);
  } catch (err) {
    console.error(err);
    console.error("Error type:", err.name);
    console.error("Error code:", err.code);
    console.error("Full error:", err);
    if (err.code === 11000) {
      return res.status(CONFLICT_ERROR_CODE).json({
        message: "Email already exists",
      });
    }
    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST_ERROR_CODE).send({ message: err.message });
    }
    return res
      .status(SERVER_ERROR_CODE)
      .send({ message: "An error has occurred on the server" });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST_ERROR_CODE)
      .send({ message: "Required field missing." });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      res.status(UNAUTHORIZED_ERROR_CODE).send({ message: err.message });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const updateProfile = (req, res) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    {
      name: req.body.name,
      avatar: req.body.avatar,
    },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: err.message });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_ERROR_CODE)
          .send({ message: err.message });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { getUsers, createUser, getCurrentUser, login, updateProfile };
