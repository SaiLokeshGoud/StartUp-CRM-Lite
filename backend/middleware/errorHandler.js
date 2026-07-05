import { errorResponse } from '../utils/apiResponse.js';

/**
 * Global Express error handling middleware.
 * Handles Mongoose, MongoDB, JWT, and generic errors.
 */
export default function errorHandler(err, req, res, next) {
  console.error('API Error:', err);
  let statusCode = 500;
  let message = 'Server error';
  let errors = null;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});
  } else if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {}).join(', ');
    message = field ? `${field.charAt(0).toUpperCase() + field.slice(1)} already exists` : 'Duplicate key error';
    errors = err.keyValue || null;
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = err.message || 'Authentication failed';
  } else if (err.status) {
    statusCode = err.status;
    message = err.message || message;
  }

  const response = {
    success: false,
    message: err.message || message,
    stack: err.stack,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
}
