const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateDB = err => {
  const value = err.keyValue.name;
  const message = `Duplicate field value name ${value}`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handledJWTError = () => {
  return new AppError('Invalid token. Please login again', 401);
};

const handledJWTExpiredError = () => {
  return new AppError('Your token has expired', 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message
  });
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

    //////
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error, res);
    if (error.name === 'JsonWebTokenError') error = handledJWTError(error);
    sendErrorProd(error, res);
    if (error.name === 'TokenExpiredError') error = handledJWTExpiredError();

    sendErrorProd(error, res);
  }
};
