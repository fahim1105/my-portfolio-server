import express from 'express';
import Education from '../models/Education.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// GET all (public)
router.get('/', async (req, res) => {
    try {
        const records = await Education.find().sort({ createdAt: -1 });
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create (protected)
router.post('/', verifyToken, async (req, res) => {
    try {
        const record = new Education(req.body);
        const saved = await record.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update (protected)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updated = await Education.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updated) return res.status(404).json({ message: 'Record not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE (protected)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deleted = await Education.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Record not found' });
        res.json({ message: 'Education record deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
