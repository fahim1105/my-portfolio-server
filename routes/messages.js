import express from 'express';
import Message from '../models/Message.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// POST — visitor sends a message (public)
router.post('/', async (req, res) => {
    try {
        const { name, email, title, message } = req.body;
        if (!name || !email || !title || !message)
            return res.status(400).json({ message: 'All fields are required.' });
        const doc = await Message.create({ name, email, title, message });
        res.status(201).json(doc);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET all messages (protected)
router.get('/', verifyToken, async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH mark as read/unread (protected)
router.patch('/:id/read', verifyToken, async (req, res) => {
    try {
        const msg = await Message.findByIdAndUpdate(
            req.params.id,
            { read: req.body.read },
            { new: true }
        );
        res.json(msg);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE (protected)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
