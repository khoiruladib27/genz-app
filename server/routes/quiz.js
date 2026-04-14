const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const { protect, adminOnly } = require('../middleware/auth');

// Get all quizzes
router.get('/', protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find().select('-correct_answer -explanation');
    res.json(quizzes);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Get all with answers (admin)
router.get('/admin', protect, adminOnly, async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('createdBy', 'name');
    res.json(quizzes);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Create quiz (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const quiz = await Quiz.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(quiz);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Update quiz (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(quiz);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Delete quiz (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Soal dihapus.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Submit quiz answers
router.post('/submit', protect, async (req, res) => {
  try {
    const { answers, timeTaken } = req.body; // [{questionId, selected}]
    const Score = require('../models/Score');
    const quizIds = answers.map(a => a.questionId);
    const quizzes = await Quiz.find({ _id: { $in: quizIds } });

    let correct = 0;
    const detailed = answers.map(a => {
      const quiz = quizzes.find(q => q._id.toString() === a.questionId);
      const isCorrect = quiz && quiz.correct_answer === a.selected;
      if (isCorrect) correct++;
      return { questionId: a.questionId, selected: a.selected, correct: isCorrect };
    });

    const score = Math.round((correct / quizzes.length) * 100);
    const saved = await Score.create({
      user_id: req.user._id, score, totalQuestions: quizzes.length,
      answers: detailed, timeTaken
    });

    // Return with explanations
    const result = quizzes.map(q => ({
      _id: q._id, question: q.question, options: q.options,
      correct_answer: q.correct_answer, explanation: q.explanation
    }));

    res.json({ score, correct, total: quizzes.length, details: result, scoreId: saved._id });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
