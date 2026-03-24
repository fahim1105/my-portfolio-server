import express from 'express';
import Project from '../models/Project.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// GET all projects (public)
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: 1, createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single project (public)
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create project (protected)
router.post('/', verifyToken, async (req, res) => {
    try {
        const project = new Project(req.body);
        const saved = await project.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update project (protected)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updated) return res.status(404).json({ message: 'Project not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PATCH bulk reorder (protected) — body: [{ _id, order }, ...]
router.patch('/reorder', verifyToken, async (req, res) => {
    try {
        const updates = req.body;
        await Promise.all(
            updates.map(({ _id, order }) =>
                Project.findByIdAndUpdate(_id, { order })
            )
        );
        res.json({ message: 'Reordered successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE project (protected)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deleted = await Project.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Project not found' });
        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
