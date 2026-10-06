// middleware/errorMiddleware.js - Global Error Handling Middleware

/**
 * errorHandler - Catches errors passed via next(err) and sends a clean JSON response.
 * Must be placed LAST in the middleware chain in server.js.
 */
const errorHandler = (err, req, res, next) => {
  // Use the status code set on the response, fallback to 500
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  console.error(`[ERROR] ${err.message}`);

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    // Show stack trace only in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

/**
 * notFound - Middleware for handling 404 routes.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = { errorHandler, notFound };
