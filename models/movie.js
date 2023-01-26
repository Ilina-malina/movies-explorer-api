const mongoose = require('mongoose');
const { default: isURL } = require('validator/lib/isURL');
const { nameEnRegex, nameRuRegex } = require('../utils/constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isURL(link),
      message: (props) => `${props.value} is not a valid link!`,
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isURL(link),
      message: (props) => `${props.value} is not a valid link!`,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isURL(link),
      message: (props) => `${props.value} is not a valid link!`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return nameRuRegex.test(v);
      },
      message: (props) => `${props.value} is not a valid. Use cyrillic alphabet!`,
    },
  },
  nameEN: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return nameEnRegex.test(v);
      },
      message: (props) => `${props.value} is not a valid. Use latin alphabet!`,
    },
  },
});

module.exports = mongoose.model('movie', movieSchema);
