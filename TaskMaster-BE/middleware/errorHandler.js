const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.statusCode,
    message: err.message,
  });
};

export default globalErrorHandler;

export class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? 'failed' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
