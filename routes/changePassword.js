import express from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.patch('/change-password', verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword)
            return res.status(400).json({ message: 'Both fields are required' });
        if (newPassword.length < 6)
            return res.status(400).json({ message: 'New password must be at least 6 characters' });

        const admin = await Admin.findOne({ email: req.user.email });
        if (!admin)
            return res.status(404).json({ message: 'Admin not found' });

        const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
        if (!isMatch)
            return res.status(401).json({ message: 'Current password is incorrect' });

        admin.passwordHash = await bcrypt.hash(newPassword, 12);
        await admin.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
