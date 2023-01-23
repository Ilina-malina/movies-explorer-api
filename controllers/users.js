const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');
const { NotFoundError } = require('../utils/NotFoundError');
const { BadRequestError } = require('../utils/BadRequestError');
const { ConflictError } = require('../utils/ConflictError');
const { AuthorizationError } = require('../utils/AuthorizationError');
const {
  SUCCESS,
  CREATED,
  CONFLICT_ERROR_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
  BAD_REQUEST_MESSAGE,
  AUTH_ERROR_MESSAGE,
} = require('../utils/constants');

const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      name,
      password: hash,
    }))
    .then(() => res.status(CREATED).send({
      email,
      name,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError({ statusCode: 409, message: CONFLICT_ERROR_MESSAGE }));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError({ statusCode: 400, message: BAD_REQUEST_MESSAGE }));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'very-secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new AuthorizationError({ statusCode: 401, message: AUTH_ERROR_MESSAGE }));
    });
};

const getMyself = (req, res, next) => {
  User.findById(req.user)
    .orFail(new NotFoundError({ statusCode: 404, message: USER_NOT_FOUND_MESSAGE }))
    .then((user) => {
      res.status(SUCCESS).json(user);
    }).catch(next);
};

const updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  }).orFail(new NotFoundError({ statusCode: 404, message: USER_NOT_FOUND_MESSAGE }))
    .then((user) => {
      res.status(SUCCESS).json(user);
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ statusCode: 400, message: BAD_REQUEST_MESSAGE }));
      } else if (err.code === 11000) {
        next(new ConflictError({ statusCode: 409, message: CONFLICT_ERROR_MESSAGE }));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getMyself,
  updateProfile,
};
