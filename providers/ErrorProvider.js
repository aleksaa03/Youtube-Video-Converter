const ErrorProvider = (res, statusCode, errorMessage) => {
  res.setHeader("Content-Type", "application/json");
  res.status(statusCode).json({ errorMessage });
};

module.exports = { ErrorProvider };
