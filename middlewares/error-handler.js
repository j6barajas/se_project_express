const errorHandler = (err, req, res, next) => {
  console.error(error);
  const statusCode = err.statusCode || 500;
  const message = err.message || "An error occurred on the server";
  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
