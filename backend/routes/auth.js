const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, name, institution, walletAddress } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = new User({
      email,
      password,
      role,
      name,
      institution,
      walletAddress
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !await user.comparePassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'Account deactivated' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
      name: req.user.name,
      walletAddress: req.user.walletAddress
    }
  });
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, institution, walletAddress } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, institution, walletAddress },
      { new: true }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Profile update failed' });
  }
});

module.exports = router;