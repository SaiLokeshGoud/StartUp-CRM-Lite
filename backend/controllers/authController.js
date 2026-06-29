import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Generate a signed JWT for the authenticated user.
 * @param {string} userId
 * @returns {string}
 */
export function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

/**
 * Register a new user account.
 */
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    const userData = user.toObject();
    delete userData.password;

    return res.status(201).json({ success: true, token, user: userData });
  } catch (error) {
    return next(error);
  }
}

/**
 * Authenticate existing user and return JWT.
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }

    const token = generateToken(user._id);
    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({ success: true, token, user: userData });
  } catch (error) {
    return next(error);
  }
}

/**
 * Return authenticated user profile.
 */
export async function getProfile(req, res, next) {
  try {
    return res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    return next(error);
  }
}

/**
 * Update authenticated user profile name and optionally password.
 */
export async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, oldPassword, newPassword } = req.body;

    if (name) {
      user.name = name;
    }

    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ success: false, message: 'Old password is required to update password' });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      user.password = newPassword;
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    return next(error);
  }
}
