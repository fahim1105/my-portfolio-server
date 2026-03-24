import express from 'express';
import Seo from '../models/Seo.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// GET all SEO entries (public — used by portfolio pages)
router.get('/', async (req, res) => {
    try {
        const entries = await Seo.find();
        res.json(entries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single page SEO (public)
router.get('/:page', async (req, res) => {
    try {
        const entry = await Seo.findOne({ page: req.params.page });
        res.json(entry || {});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT upsert SEO for a page (protected)
router.put('/:page', verifyToken, async (req, res) => {
    try {
        const entry = await Seo.findOneAndUpdate(
            { page: req.params.page },
            { ...req.body, page: req.params.page },
            { new: true, upsert: true }
        );
        res.json(entry);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
