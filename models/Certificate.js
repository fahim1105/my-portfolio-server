import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        issuer: { type: String, required: true },
        description: { type: String, default: '' },
        imageURL: { type: String, default: '' },
    },
    { timestamps: true }
);

export default mongoose.model('Certificate', certificateSchema);
