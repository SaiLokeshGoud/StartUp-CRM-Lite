import express from 'express';
import { body } from 'express-validator';
import { register, login, googleLogin, getProfile, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('oldPassword')
    .optional()
    .isLength({ min: 6 }).withMessage('Old password must be at least 6 characters'),
  body('newPassword')
    .optional()
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
];

/**
 * User registration endpoint.
 */
router.post('/register', validate(registerValidation), register);

/**
 * User login endpoint.
 */
router.post('/login', validate(loginValidation), login);

/**
 * Google Sign-In endpoint.
 */
router.post('/google', googleLogin);

/**
 * Get authenticated user profile.
 */
router.get('/profile', protect, getProfile);

/**
 * Update authenticated user profile.
 */
router.put('/profile', protect, validate(updateProfileValidation), updateProfile);

export default router;
