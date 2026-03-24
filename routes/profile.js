import express from 'express';
import Profile from '../models/Profile.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// GET profile (public)
router.get('/', async (req, res) => {
    try {
        const profile = await Profile.findOne({ key: 'main' });
        res.json(profile || {});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT upsert profile (protected)
router.put('/', verifyToken, async (req, res) => {
    try {
        const profile = await Profile.findOneAndUpdate(
            { key: 'main' },
            { ...req.body, key: 'main' },
            { new: true, upsert: true, runValidators: true }
        );
        res.json(profile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
