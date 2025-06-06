// backend/routes/nutrition.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');

// 1. API lấy tổng dinh dưỡng trong ngày
// server/routes/nutrition.js
router.get('/nutrition-summary', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const date = req.query.date; // ex: '2025-06-06'

    if (!date) return res.status(400).json({ message: 'Missing date' });

    try {
        const [rows] = await db.promise().query(
            `SELECT 
         IFNULL(ROUND(SUM(calo), 2), 0) AS calo,
         IFNULL(ROUND(SUM(protein), 2), 0) AS protein,
         IFNULL(ROUND(SUM(carb), 2), 0) AS carb,
         IFNULL(ROUND(SUM(fat), 2), 0) AS fat
       FROM bua_an
       JOIN thong_tin_dinh_duong_bua_an ON bua_an.id = thong_tin_dinh_duong_bua_an.bua_an_id
       WHERE bua_an.user_id = ? AND DATE(bua_an.date) = ?`,
            [userId, date]
        );
        // rows[0] luôn tồn tại, IFNULL giúp mặc định 0
        res.json(rows[0]);
    } catch (err) {
        console.error("Error getting nutrition summary:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// 2. API lấy goal của user
router.get('/profile-goal', verifyToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const [[goal]] = await db.promise().query(
            'SELECT calo_goal, protein_goal, carb_goal, fat_goal FROM ke_hoach_dinh_duong WHERE user_id = ? LIMIT 1',
            [userId]
        );

        if (goal) return res.json(goal);

        const [[info]] = await db.promise().query(
            'SELECT calorie_need FROM physical_info WHERE user_id = ? LIMIT 1',
            [userId]
        );

        if (info) {
            const calo = info.calorie_need;
            return res.json({
                calo_goal: calo,
                protein_goal: (calo * 0.15 / 4).toFixed(2),
                carb_goal: (calo * 0.55 / 4).toFixed(2),
                fat_goal: (calo * 0.3 / 9).toFixed(2),
            });
        }

        res.status(404).json({ message: 'No goal info found' });
    } catch (err) {
        console.error('Error getting profile goal:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
