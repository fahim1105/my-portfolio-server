import express from 'express';
import SocialLink from '../models/SocialLink.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// GET all (public)
router.get('/', async (req, res) => {
    try {
        const links = await SocialLink.find().sort({ createdAt: 1 });
        res.json(links);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create (protected)
router.post('/', verifyToken, async (req, res) => {
    try {
        const link = new SocialLink(req.body);
        const saved = await link.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update (protected)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updated = await SocialLink.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updated) return res.status(404).json({ message: 'Link not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE (protected)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deleted = await SocialLink.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Link not found' });
        res.json({ message: 'Social link deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
