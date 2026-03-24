import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema(
    {
        platform: { type: String, required: true, trim: true },
        icon: { type: String, required: true },   // e.g. "FaGithub"
        url: { type: String, required: true },
        username: { type: String, default: '' },
        color: { type: String, default: '' },
    },
    { timestamps: true }
);

export default mongoose.model('SocialLink', socialLinkSchema);
