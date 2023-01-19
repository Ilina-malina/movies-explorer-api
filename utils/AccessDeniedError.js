class AccessDeniedError extends Error {
  constructor({ message, statusCode }) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = {
  AccessDeniedError,
};
