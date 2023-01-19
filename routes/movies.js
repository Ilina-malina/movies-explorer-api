const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { nameEnRegex, nameRuRegex } = require('../utils/constants');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

moviesRouter.get('/', getMovies);

moviesRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().URL(),
    trailer: Joi.string().required().URL(),
    nameRU: Joi.string().required().pattern(nameRuRegex),
    nameEN: Joi.string().required().pattern(nameEnRegex),
    thumbnail: Joi.string().required().URL(),
    movieId: Joi.string().required(),
  }),
}), createMovie);

moviesRouter.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = moviesRouter;
