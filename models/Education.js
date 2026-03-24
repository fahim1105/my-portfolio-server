import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
    {
        institution: { type: String, required: true, trim: true },
        degree: { type: String, required: true },
        duration: { type: String, required: true },
        result: { type: String, default: '' },
        logo: { type: String, default: '' },
        status: { type: String, enum: ['Ongoing', 'Completed'], default: 'Completed' },
    },
    { timestamps: true }
);

export default mongoose.model('Education', educationSchema);
