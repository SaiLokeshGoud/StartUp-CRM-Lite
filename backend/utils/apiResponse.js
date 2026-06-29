/**
 * Send a consistent success response.
 * @param {import('express').Response} res
 * @param {*} data
 * @param {string} message
 * @param {number} [statusCode=200]
 */
export function successResponse(res, data, message, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Send a consistent error response.
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} [statusCode=500]
 * @param {object|null} [errors=null]
 */
export function errorResponse(res, message, statusCode = 500, errors = null) {
  const payload = {
    success: false,
    message,
  };

  if (errors) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
}

/**
 * Send a paginated list response.
 * @param {import('express').Response} res
 * @param {*} data
 * @param {number} total
 * @param {number} page
 * @param {number} limit
 */
export function paginatedResponse(res, data, total, page, limit) {
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
}
