// routes/meal.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');

// routes/meal.js
router.post('/meals', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { items } = req.body;  // items = [{ food_name, quantity }, ...]
    if (!Array.isArray(items) || !items.length) {
        return res.status(400).json({ message: 'Chưa có món ăn nào để lưu.' });
    }

    try {
        // 1) tạo bữa ăn
        const [mealResult] = await db.promise().query(
            'INSERT INTO bua_an (user_id, date) VALUES (?, NOW())',
            [userId]
        );
        const mealId = mealResult.insertId;

        // 2) chèn chi tiết món ăn kèm số lượng
        for (let { food_name, quantity } of items) {
            // a) tìm hoặc tạo mon_an
            const [[found]] = await db.promise().query(
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

                // ✅ Sau khi tạo món mới, gọi Nutritionix và lưu dinh dưỡng
                try {
                    const nutri = await fetchNutritionix(food_name);
                    await db.promise().query(
                        `INSERT INTO thong_tin_dinh_duong 
             (mon_an_id, calo, protein, carb, fat)
             VALUES (?, ?, ?, ?, ?)`,
                        [
                            monAnId,
                            nutri.nf_calories * quantity,
                            nutri.nf_protein * quantity,
                            nutri.nf_total_carbohydrate * quantity,
                            nutri.nf_total_fat * quantity
                        ]
                    );
                } catch (err) {
                    console.warn(`⚠️ Không thể lấy dinh dưỡng cho ${food_name}:`, err.message);
                    // Không throw — tiếp tục xử lý bình thường
                }
            }


            // b) chèn vào mon_an_bua_an kèm quantity
            await db.promise().query(
                'INSERT INTO mon_an_bua_an (bua_an_id, mon_an_id, quantity) VALUES (?, ?, ?)',
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
