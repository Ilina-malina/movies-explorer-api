require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { limiter } = require('./middlewares/limiter');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { handleErrors } = require('./middlewares/handleErrors');

const { PORT = 3000, NODE_ENV, MONGO_ADDRESS } = process.env;

const app = express();

const allowedCors = ['http://my-movies.nomoredomains.club', 'https://my-movies.nomoredomains.club', 'localhost:3000', 'http://localhost:3000'];
app.use(cors(allowedCors));

app.use(limiter);
app.use(requestLogger);

app.use(helmet());
app.disable('x-powered-by');

mongoose.connect(NODE_ENV === 'production' ? MONGO_ADDRESS : 'mongodb://127.0.0.1/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());
app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
