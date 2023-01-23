const jwt = require('jsonwebtoken');
const { AuthorizationError } = require('../utils/AuthorizationError');
const { AUTH_ERROR_MESSAGE } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthorizationError({ statusCode: 401, message: AUTH_ERROR_MESSAGE }));
    return;
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'very-secret-key');
  } catch {
    next(new AuthorizationError({ statusCode: 401, message: AUTH_ERROR_MESSAGE }));
  }

  req.user = payload;

  next();
};

module.exports = {
  auth,
};
