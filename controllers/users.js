// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { NotFoundError } = require('../utils/NotFoundError');
const { BadRequestError } = require('../utils/BadRequestError');
const { ConflictError } = require('../utils/ConflictError');

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
  getMyself,
  updateProfile,
};
