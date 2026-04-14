const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email sudah terdaftar.' });

    const user = await User.create({ name, email, password, role: role === 'admin' ? 'admin' : 'student' });
    const token = signToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Email atau password salah.' });

    user.lastLogin = new Date();
    user.loginSessions.push({ loginAt: new Date() });
    await user.save();

    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Logout (update duration)
router.post('/logout', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const sessions = user.loginSessions;
    if (sessions.length > 0) {
      const last = sessions[sessions.length - 1];
      if (!last.logoutAt) {
        last.logoutAt = new Date();
        last.duration = Math.round((last.logoutAt - last.loginAt) / 60000);
      }
    }
    await user.save();
    res.json({ message: 'Logout berhasil.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
});

module.exports = router;
