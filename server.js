import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import authRoutes from './routes/auth.js';
import changePasswordRoutes from './routes/changePassword.js';
import projectRoutes from './routes/projects.js';
import educationRoutes from './routes/education.js';
import socialRoutes from './routes/socials.js';
import certificateRoutes from './routes/certificates.js';
import profileRoutes from './routes/profile.js';
import messageRoutes from './routes/messages.js';
import seoRoutes from './routes/seo.js';
import analyticsRoutes from './routes/analytics.js';
import Admin from './models/Admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000', 'https://asif-al-fattha-fahim.pages.dev'] }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', changePasswordRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/socials', socialRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/', (req, res) => res.json({ status: 'Portfolio API running' }));

// Connect to MongoDB and start server
mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('✅ MongoDB connected');

        // Seed admin from env if not exists in DB
        const existing = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
        if (!existing) {
            const hash = process.env.ADMIN_PASSWORD_HASH
                ? process.env.ADMIN_PASSWORD_HASH
                : await bcrypt.hash(process.env.ADMIN_PASSWORD || 'changeme123', 12);
            await Admin.create({ email: process.env.ADMIN_EMAIL, passwordHash: hash });
            console.log('✅ Admin seeded from env');
        }

        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });
