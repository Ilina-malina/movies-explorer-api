const Movie = require('../models/movie');
const { BadRequestError } = require('../utils/BadRequestError');
const { NotFoundError } = require('../utils/NotFoundError');
const { AccessDeniedError } = require('../utils/AccessDeniedError');

const getMovies = (req, res, next) => {
  Movie.find({}).populate('owner').then((movies) => {
    res.status(200).json(movies);
  }).catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  }).then(async (movie) => {
    await movie.populate('owner');
    res.status(201).json(movie);
  }).catch((err) => {
    if (err.name === 'ValidationAppError') {
      next(new BadRequestError({ statusCode: 400, message: 'Переданы некорректные данные' }));
    } else {
      next(err);
    }
  });
};

const deleteMovie = async (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError({ statusCode: 404, message: 'Фильм не найден' }))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        next(new AccessDeniedError({ statusCode: 403, message: 'Ошибка доступа' }));
      } else {
        movie.remove()
          .then(() => {
            res.status(200).json({ message: 'Фильм удален!' });
          });
      }
    }).catch((err) => {
      if (err.name === 'CastAppError') {
        next(new BadRequestError({ statusCode: 400, message: 'Переданы некорректные данные' }));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
