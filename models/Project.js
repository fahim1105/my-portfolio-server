import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        imageURL: { type: String, required: true },
        techStack: { type: [String], default: [] },
        liveLink: { type: String, default: '' },
        githubLink: { type: String, default: '' },
        challenges: { type: String, default: '' },
        futurePlans: { type: String, default: '' },
        features: { type: [String], default: [] },
        duration: { type: String, default: '' },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
