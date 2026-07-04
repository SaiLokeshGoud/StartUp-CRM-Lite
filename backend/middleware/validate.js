import { validationResult } from 'express-validator';

/**
 * Run express-validator validations and return formatted errors if any.
 * @param {import('express-validator').ValidationChain[]} validations
 */
export const validate = (validations) => async (req, res, next) => {
  await Promise.all(validations.map((validation) => validation.run(req)));

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed: ' + errors.array().map((error) => error.msg).join(', '),
      errors: errors.array().map((error) => ({ field: error.path || error.param, message: error.msg })),
    });
  }

  return next();
};
