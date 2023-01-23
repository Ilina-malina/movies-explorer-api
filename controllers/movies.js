const Movie = require('../models/movie');
const { BadRequestError } = require('../utils/BadRequestError');
const { NotFoundError } = require('../utils/NotFoundError');
const { AccessDeniedError } = require('../utils/AccessDeniedError');

const {
  ACCESS_DENIED_MESSAGE,
  MOVIE_NOT_FOUND_MESSAGE,
  BAD_REQUEST_MESSAGE,
  MOVIE_DELETED_MESSAGE,
  SUCCESS,
  CREATED,
} = require('../utils/constants');

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
    res.status(CREATED).json(movie);
  }).catch((err) => {
    if (err.name === 'ValidationAppError') {
      next(new BadRequestError({ statusCode: 400, message: BAD_REQUEST_MESSAGE }));
    } else {
      next(err);
    }
  });
};

const deleteMovie = async (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError({ statusCode: 404, message: MOVIE_NOT_FOUND_MESSAGE }))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        next(new AccessDeniedError({ statusCode: 403, message: ACCESS_DENIED_MESSAGE }));
      } else {
        movie.remove()
          .then(() => {
            res.status(SUCCESS).json({ message: MOVIE_DELETED_MESSAGE });
          });
      }
    }).catch((err) => {
      if (err.name === 'CastAppError') {
        next(new BadRequestError({ statusCode: 400, message: BAD_REQUEST_MESSAGE }));
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
