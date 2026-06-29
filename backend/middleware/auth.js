import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes by validating JWT tokens and attaching the user to req.user.
 * In production, consider adding express-rate-limit here or on sensitive auth routes.
 */
export async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token provided, access denied' });
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token has expired, please login again' });
      }
      return res.status(401).json({ success: false, message: 'Token is invalid' });
    }

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}
