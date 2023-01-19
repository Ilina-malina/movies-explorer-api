require('dotenv').config();

const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const { PORT = 3000 } = process.env;

const app = express();
app.use(limiter);

mongoose.connect('mongodb://127.0.0.1/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());

app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
