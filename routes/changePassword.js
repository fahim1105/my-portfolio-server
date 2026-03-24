import express from 'express';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ENV_PATH = path.join(__dirname, '../.env');

// PATCH /api/auth/change-password (protected)
router.patch('/change-password', verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword)
            return res.status(400).json({ message: 'Both fields are required' });

        if (newPassword.length < 6)
            return res.status(400).json({ message: 'New password must be at least 6 characters' });

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, process.env.ADMIN_PASSWORD_HASH);
        if (!isMatch)
            return res.status(401).json({ message: 'Current password is incorrect' });

        // Hash new password
        const newHash = await bcrypt.hash(newPassword, 12);

        // Update .env file
        let envContent = fs.readFileSync(ENV_PATH, 'utf8');
        if (envContent.includes('ADMIN_PASSWORD_HASH=')) {
            envContent = envContent.replace(
                /^ADMIN_PASSWORD_HASH=.*$/m,
                `ADMIN_PASSWORD_HASH=${newHash}`
            );
        } else {
            envContent += `\nADMIN_PASSWORD_HASH=${newHash}`;
        }
        fs.writeFileSync(ENV_PATH, envContent, 'utf8');

        // Update in-memory env so no restart needed
        process.env.ADMIN_PASSWORD_HASH = newHash;

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
