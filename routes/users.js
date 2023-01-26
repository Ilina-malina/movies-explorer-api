const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMyself,
  updateProfile,
} = require('../controllers/users');

usersRouter.get('/me', getMyself);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(2).max(30),
    name: Joi.string().min(2).max(30),
  }),
}), updateProfile);

module.exports = usersRouter;
