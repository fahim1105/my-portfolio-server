import express from 'express';
import Certificate from '../models/Certificate.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// GET all (public)
router.get('/', async (req, res) => {
    try {
        const certs = await Certificate.find().sort({ createdAt: -1 });
        res.json(certs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create (protected)
router.post('/', verifyToken, async (req, res) => {
    try {
        const cert = new Certificate(req.body);
        const saved = await cert.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update (protected)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updated = await Certificate.findByIdAndUpdate(req.params.id, req.body, {
            new: true, runValidators: true,
        });
        if (!updated) return res.status(404).json({ message: 'Certificate not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE (protected)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deleted = await Certificate.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Certificate not found' });
        res.json({ message: 'Certificate deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
