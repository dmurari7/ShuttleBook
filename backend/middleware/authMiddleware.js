const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET || 'default_secret';

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, jwtSecret);

    // Attach user to request without password
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid token: user not found' });
    }

    req.user = user; // accessible in route handlers
    next();
  } catch (err) {
    console.error('Auth error', err);
    return res.status(401).json({ message: 'Not authorized' });
  }
}

module.exports = authMiddleware;
