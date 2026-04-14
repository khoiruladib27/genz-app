const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// Get my scores
router.get('/my', protect, async (req, res) => {
  try {
    const scores = await Score.find({ user_id: req.user._id }).sort({ date: -1 });
    res.json(scores);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: all scores
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const scores = await Score.find().populate('user_id', 'name email').sort({ date: -1 });
    res.json(scores);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: all users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('-password');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Admin: export to Excel (JSON format for client-side xlsx)
router.get('/export', protect, adminOnly, async (req, res) => {
  try {
    const scores = await Score.find().populate('user_id', 'name email').sort({ date: -1 });
    const data = scores.map(s => ({
      Nama: s.user_id?.name || 'N/A',
      Email: s.user_id?.email || 'N/A',
      Nilai: s.score,
      'Total Soal': s.totalQuestions,
      'Waktu (detik)': s.timeTaken || '-',
      Tanggal: new Date(s.date).toLocaleDateString('id-ID')
    }));
    res.json(data);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
