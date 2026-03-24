import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
    {
        page: { type: String, required: true },   // e.g. '/', '/projects', '/contact'
        ip: { type: String, default: '' },
        country: { type: String, default: 'Unknown' },
        userAgent: { type: String, default: '' },
    },
    { timestamps: true }
);

export default mongoose.model('Analytics', analyticsSchema);
