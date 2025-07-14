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
const ConflictError = require("../errors/conflict-err");
const BadRequestError = require("../errors/bad-request-err");
const UnauthorizedError = require("../errors/unauthorized-err");
const NotFoundError = require("../errors/not-found-err");
const { exists } = require("../models/clothingItem");

const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, avatar, email, password: hash });
    const { password: pwd, ...userWithoutPassword } = user.toObject();
    return res.status(201).send(userWithoutPassword);
  } catch (err) {
    if (err.code === 11000) {
      return next(new ConflictError("Email already exists"));
    } else if (err.name === "ValidationError") {
      return next(new BadRequestError(err.message));
    } else {
      return next(err);
    }
  }
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Required field missing."));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError(err.message));
      } else {
        return next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError(err.message));
      } else if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError(err.message));
      } else {
        return next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
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
      if (err.name === "CastError") {
        return next(new BadRequestError(err.message));
      } else if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      } else if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError(err.message));
      } else {
        return next(err);
      }
    });
};

module.exports = { createUser, getCurrentUser, login, updateProfile };
