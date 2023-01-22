require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { handleErrors } = require('./middlewares/handleErrors');
const { NotFoundError } = require('./utils/NotFoundError');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const { PORT = 3000 } = process.env;

const app = express();

const allowedCors = ['http://my-movies.nomoredomains.club', 'https://my-movies.nomoredomains.club', 'localhost:3000', 'http://localhost:3000'];
app.use(cors(allowedCors));

app.use(requestLogger);
app.use(limiter);

app.use(helmet());
app.disable('x-powered-by');

mongoose.connect('mongodb://127.0.0.1/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('/users', auth, usersRouter);
app.use('/movies', auth, moviesRouter);

app.use('*', (req, res, next) => {
  next(new NotFoundError({ statusCode: 404, message: 'Страница не найдена' }));
});

app.use(errorLogger);
app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
