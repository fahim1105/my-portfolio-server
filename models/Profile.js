import mongoose from 'mongoose';

// Single document — always upsert with a fixed key
const profileSchema = new mongoose.Schema(
    {
        key: { type: String, default: 'main', unique: true },

        // About Me
        name: { type: String, default: '' },
        tagline: { type: String, default: '' },
        bio: { type: String, default: '' },
        location: { type: String, default: '' },
        languages: { type: String, default: '' },
        focus: { type: String, default: '' },

        // CV / Resume URL
        cvUrl: { type: String, default: '' },

        // Skills — array of categories
        skillCategories: [
            {
                title: { type: String },
                skills: [
                    {
                        name: { type: String },
                        percentage: { type: Number },
                    }
                ]
            }
        ],

        // Services
        services: [
            {
                title: { type: String },
                desc: { type: String },
                icon: { type: String, default: 'MdWeb' },
            }
        ],
    },
    { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);
