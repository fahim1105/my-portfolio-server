import mongoose from 'mongoose';

// One doc per page slug e.g. 'home', 'projects', 'contact'
const seoSchema = new mongoose.Schema(
    {
        page: { type: String, required: true, unique: true },
        title: { type: String, default: '' },
        description: { type: String, default: '' },
        ogImage: { type: String, default: '' },
    },
    { timestamps: true }
);

export default mongoose.model('Seo', seoSchema);
