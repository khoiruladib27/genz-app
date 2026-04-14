const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  answers: [{ questionId: String, selected: Number, correct: Boolean }],
  timeTaken: Number, // in seconds
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', scoreSchema);
