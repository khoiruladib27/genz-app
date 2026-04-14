const mongoose = require('mongoose');

const materiSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  icon: { type: String, default: '📖' },
  order: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  sections: [
    {
      type: { type: String, enum: ['text', 'hikmah', 'table', 'list', 'highlight', 'comparison'], default: 'text' },
      heading: { type: String, default: '' },
      content: { type: String, default: '' },       // main text / table JSON / list JSON
      ayat: { type: String, default: '' },           // for hikmah
      terjemahan: { type: String, default: '' },     // for hikmah
      sumber: { type: String, default: '' },         // for hikmah / source
      color: { type: String, default: '#3B82F6' },  // for highlight blocks
    }
  ],
  videoUrl: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Materi', materiSchema);
