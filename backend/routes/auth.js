const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config();

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || 'default_secret';
const jwtExpiry = process.env.JWT_EXPIRES_IN || '7d';

// Helper: create token and user payload (without password)
function createTokenAndPayload(user) {
  const payload = {
    id: user._id,
    email: user.email,
    username: user.username,
  };
  const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiry });
  return { token, user: payload };
}

/**
 * POST /api/auth/signup
 * body: { username, email, password }
 */
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Hash password
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({ username, email, password: hashed });

    const { token, user: userPayload } = createTokenAndPayload(user);

    return res.status(201).json({
      message: 'User created',
      token,
      user: userPayload,
    });
  } catch (err) {
    console.error('Signup error', err);
    // E11000 duplicate key error -> uniqueness collision
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Provide email and password' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const { token, user: userPayload } = createTokenAndPayload(user);

    return res.json({ message: 'Logged in', token, user: userPayload });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /api/auth/me
 * headers: Authorization: Bearer <token>
 */
router.get('/me', authMiddleware, async (req, res) => {
  // authMiddleware already attached req.user (without password)
  return res.json({ user: req.user });
});

/**
 * GET /api/auth/all-users
 * Returns all users (without passwords)
 * headers: Authorization: Bearer <token>
 */
router.get('/all-users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude password field
    return res.json(users);
  } catch (err) {
    console.error('Error fetching users', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;