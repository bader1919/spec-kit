// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Determine status code
  let statusCode = err.statusCode || 500;
  let errorCode = 'INTERNAL_ERROR';
  let message = err.message || 'An unexpected error occurred';

  // Handle specific error types
  if (err.message === 'Invalid API credentials') {
    statusCode = 401;
    errorCode = 'UNAUTHORIZED';
  } else if (err.message === 'Resource not found') {
    statusCode = 404;
    errorCode = 'NOT_FOUND';
  } else if (err.message === 'Unable to connect to N8N instance') {
    statusCode = 503;
    errorCode = 'SERVICE_UNAVAILABLE';
  } else if (err.message === 'Rate limit exceeded') {
    statusCode = 429;
    errorCode = 'RATE_LIMIT_EXCEEDED';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
    timestamp: new Date().toISOString(),
  });
};

module.exports = errorHandler;
