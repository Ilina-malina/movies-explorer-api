const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const User = require('../models/user');
const { NotFoundError } = require('../utils/NotFoundError');
const { BadRequestError } = require('../utils/BadRequestError');
const { ConflictError } = require('../utils/ConflictError');
const { AuthorizationError } = require('../utils/AuthorizationError');

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
    .then(() => res.status(201).send({
      email,
      name,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError({ statusCode: 409, message: 'Пользователь с таким email уже существует' }));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError({ statusCode: 400, message: 'Переданы некорректные данные' }));
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
      next(new AuthorizationError({ statusCode: 401, message: 'Ошибка авторизации' }));
    });
};

const getMyself = (req, res, next) => {
  User.findById(req.user)
    .orFail(new NotFoundError({ statusCode: 404, message: 'Пользователь не найден' }))
    .then((user) => {
      res.status(200).json(user);
    }).catch(next);
};

const updateProfile = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  }).orFail(new NotFoundError({ statusCode: 404, message: 'Пользователь не найден' }))
    .then((user) => {
      res.status(200).json(user);
    }).catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError({ statusCode: 400, message: 'Переданы некорректные данные' }));
      } else if (err.code === 11000) {
        next(new ConflictError({ statusCode: 409, message: 'Пользователь с таким email уже существует' }));
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
