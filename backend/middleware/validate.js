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
      errors: errors.array().map((error) => ({ field: error.param, message: error.msg })),
    });
  }

  return next();
};
