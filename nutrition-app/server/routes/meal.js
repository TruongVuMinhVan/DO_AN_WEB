// routes/meal.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');

router.post('/meals', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { items } = req.body;
    if (!Array.isArray(items) || !items.length) {
        return res.status(400).json({ message: 'Chưa có món ăn nào để lưu.' });
    }

    try {
        // 1) tạo bữa ăn
        const [mealResult] = await db.promise().query(
            'INSERT INTO bua_an (user_id, date, food_list) VALUES (?, NOW(), ?)',
            [userId, JSON.stringify(items.map(i => i.food_name))]
        );
        const mealId = mealResult.insertId;

        // 2) lần lượt chèn chi tiết món ăn
        for (let { food_name, quantity } of items) {
            // a) tìm hoặc tạo trong mon_an
            const [rows] = await db.promise().query(
                'SELECT id FROM mon_an WHERE ten_mon = ? LIMIT 1',
                [food_name]
            );
            let monAnId;
            if (rows.length) {
                monAnId = rows[0].id;
            } else {
                const [ins] = await db.promise().query(
                    'INSERT INTO mon_an (ten_mon) VALUES (?)',
                    [food_name]
                );
                monAnId = ins.insertId;
            }

            // b) chèn vào mon_an_bua_an
            await db.promise().query(
                'INSERT INTO mon_an_bua_an (bua_an_id, mon_an_id, quantity) VALUES (?,?,?)',
                [mealId, monAnId, quantity]
            );
        }

        res.status(201).json({ message: 'Saved meal successfully', mealId });
    } catch (err) {
        console.error('❌ Lỗi lưu bữa ăn:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
