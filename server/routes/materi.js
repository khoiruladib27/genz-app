const express = require('express');
const router = express.Router();
const Materi = require('../models/Materi');
const { protect, adminOnly } = require('../middleware/auth');

// GET all materi (public - published only for students, all for admin)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isPublished: true };
    const materi = await Materi.find(filter).sort({ order: 1, createdAt: 1 }).populate('createdBy', 'name');
    res.json(materi);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET single materi
router.get('/:id', async (req, res) => {
  try {
    const materi = await Materi.findById(req.params.id).populate('createdBy', 'name');
    if (!materi) return res.status(404).json({ message: 'Materi tidak ditemukan.' });
    res.json(materi);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST create materi (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const materi = await Materi.create({ ...req.body, createdBy: req.user._id, updatedAt: new Date() });
    res.status(201).json(materi);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT update materi (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const materi = await Materi.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!materi) return res.status(404).json({ message: 'Materi tidak ditemukan.' });
    res.json(materi);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE materi (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const materi = await Materi.findByIdAndDelete(req.params.id);
    if (!materi) return res.status(404).json({ message: 'Materi tidak ditemukan.' });
    res.json({ message: 'Materi berhasil dihapus.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT reorder materi (admin) - update order for multiple items
router.put('/reorder/batch', protect, adminOnly, async (req, res) => {
  try {
    const { items } = req.body; // [{id, order}]
    await Promise.all(items.map(item => Materi.findByIdAndUpdate(item.id, { order: item.order })));
    res.json({ message: 'Urutan materi diperbarui.' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
