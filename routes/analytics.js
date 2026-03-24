import express from 'express';
import Analytics from '../models/Analytics.js';
import Project from '../models/Project.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// POST — track a page visit (public, called silently from frontend)
router.post('/track', async (req, res) => {
    try {
        const { page } = req.body;
        if (!page) return res.status(400).json({ message: 'page required' });

        const ip =
            req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
            req.socket?.remoteAddress ||
            '';

        const userAgent = req.headers['user-agent'] || '';

        // Simple country detection via free ip-api (no key needed)
        let country = 'Unknown';
        if (ip && ip !== '::1' && ip !== '127.0.0.1') {
            try {
                const geo = await fetch(`http://ip-api.com/json/${ip}?fields=country`);
                const geoData = await geo.json();
                if (geoData.country) country = geoData.country;
            } catch { /* silent */ }
        }

        await Analytics.create({ page, ip, country, userAgent });
        res.status(201).json({ ok: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET stats (protected — admin only)
router.get('/stats', verifyToken, async (req, res) => {
    try {
        const total = await Analytics.countDocuments();

        // Last 7 days daily counts
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const dailyRaw = await Analytics.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Fill missing days with 0
        const daily = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const found = dailyRaw.find(r => r._id === key);
            daily.push({ date: label, views: found ? found.count : 0 });
        }

        // Last 30 days daily counts
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
        thirtyDaysAgo.setHours(0, 0, 0, 0);

        const monthlyRaw = await Analytics.aggregate([
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const monthly = [];
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const found = monthlyRaw.find(r => r._id === key);
            monthly.push({ date: label, views: found ? found.count : 0 });
        }
        const topPagesRaw = await Analytics.aggregate([
            { $group: { _id: '$page', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 6 }
        ]);

        // Resolve project IDs in page paths
        const topPages = await Promise.all(topPagesRaw.map(async (p) => {
            const match = p._id.match(/^\/project\/([a-f0-9]{24})$/i);
            if (match) {
                try {
                    const project = await Project.findById(match[1]).select('title');
                    return { ...p, _id: project ? `Project: ${project.title}` : p._id };
                } catch { /* keep raw */ }
            }
            return p;
        }));

        // Today's count
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayCount = await Analytics.countDocuments({ createdAt: { $gte: todayStart } });

        // Device type breakdown from user-agent
        const allVisits = await Analytics.find({}, { userAgent: 1 });
        const deviceCounts = { Mobile: 0, Desktop: 0, Tablet: 0 };
        for (const v of allVisits) {
            const ua = v.userAgent || '';
            if (/tablet|ipad|playbook|silk/i.test(ua)) {
                deviceCounts.Tablet++;
            } else if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) {
                deviceCounts.Mobile++;
            } else {
                deviceCounts.Desktop++;
            }
        }
        const devices = Object.entries(deviceCounts).map(([name, value]) => ({ name, value }));

        res.json({ total, todayCount, daily, monthly, devices, topPages });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
