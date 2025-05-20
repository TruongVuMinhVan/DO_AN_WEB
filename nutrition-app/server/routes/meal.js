const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');
const fetch = require('node-fetch'); // Nếu chưa cài: npm install node-fetch

async function fetchNutritionix(foodName) {
    const APP_ID = '54ad9056';
    const API_KEY = 'fc86a343882b8a1f25a02bbd028f6c1c';
    const url = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'x-app-id': APP_ID,
            'x-app-key': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: foodName })
    });
    if (!res.ok) throw new Error('Nutritionix API error');
    const data = await res.json();
    if (!data.foods || !data.foods.length) throw new Error('No nutrition data found');
    return data.foods[0];
}

// Lấy report từ lịch sử bữa ăn
router.get('/meals/report', verifyToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const [history] = await db.promise().query(
            `SELECT danh_sach_bua_an, thoi_gian FROM lich_su_bua_an WHERE user_id = ? ORDER BY thoi_gian DESC`,
            [userId]
        );

        let result = [];
        for (const row of history) {
            const items = JSON.parse(row.danh_sach_bua_an);
            for (const item of items) {
                result.push({
                    ...item,
                    thoi_gian: row.thoi_gian
                });
            }
        }

        res.json(result);
    } catch (err) {
        console.error('Lỗi lấy report:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Lưu lịch sử bữa ăn vào lich_su_bua_an (dùng cho dashboard/report)
router.post('/meals', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { items } = req.body;

    if (!Array.isArray(items) || !items.length) {
        return res.status(400).json({ message: 'Chưa có món ăn nào để lưu.' });
    }

    try {
        await db.promise().query('START TRANSACTION');

        // 1. Tạo record bữa ăn
        const [mealInsert] = await db.promise().query(
            'INSERT INTO bua_an (user_id, date) VALUES (?, NOW())',
            [userId]
        );
        const mealId = mealInsert.insertId;

        // 2. Xử lý từng món ăn
        for (let item of items) {
            const { food_name, quantity } = item;

            // 2.1 Tìm hoặc tạo món ăn
            const [[found]] = await db.promise().query(
                'SELECT id FROM mon_an WHERE ten_mon = ? LIMIT 1',
                [food_name]
            );
            let monAnId = found?.id;
            if (!monAnId) {
                const [insertRes] = await db.promise().query(
                    'INSERT INTO mon_an (ten_mon) VALUES (?)',
                    [food_name]
                );
                monAnId = insertRes.insertId;
            }

            // 2.2 Lưu vào bảng trung gian
            await db.promise().query(
                'INSERT INTO mon_an_bua_an (bua_an_id, mon_an_id, quantity) VALUES (?, ?, ?)',
                [mealId, monAnId, quantity]
            );

            // 2.3 Lấy hoặc gọi API để lấy dinh dưỡng
            let [nutriRows] = await db.promise().query(
                'SELECT calo, protein, carb, fat FROM thong_tin_dinh_duong WHERE mon_an_id = ? LIMIT 1',
                [monAnId]
            );

            let nutri;
            if (!nutriRows.length) {
                try {
                    nutri = await fetchNutritionix(food_name);
                } catch (err) {
                    console.warn(`⚠️ Không thể lấy dinh dưỡng cho ${food_name}: ${err.message}`);
                    nutri = {
                        nf_calories: 0,
                        nf_protein: 0,
                        nf_total_carbohydrate: 0,
                        nf_total_fat: 0
                    };
                }
            } else {
                nutri = {
                    nf_calories: nutriRows[0].calo,
                    nf_protein: nutriRows[0].protein,
                    nf_total_carbohydrate: nutriRows[0].carb,
                    nf_total_fat: nutriRows[0].fat
                };
            }

            // 2.4 Upsert thông tin dinh dưỡng
            await db.promise().query(
                `INSERT INTO thong_tin_dinh_duong (mon_an_id, calo, protein, carb, fat)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           calo = VALUES(calo),
           protein = VALUES(protein),
           carb = VALUES(carb),
           fat = VALUES(fat)`,
                [
                    monAnId,
                    nutri.nf_calories * quantity,
                    nutri.nf_protein * quantity,
                    nutri.nf_total_carbohydrate * quantity,
                    nutri.nf_total_fat * quantity
                ]
            );

            // 2.5 Gán vào `item` để lưu vào `lich_su_bua_an`
            item.calo = nutri.nf_calories * quantity;
            item.protein = nutri.nf_protein * quantity;
            item.carb = nutri.nf_total_carbohydrate * quantity;
            item.fat = nutri.nf_total_fat * quantity;
        }

        // 3. Lưu bản ghi lich_su_bua_an (để truy xuất lịch sử nhanh)
        await db.promise().query(
            'INSERT INTO lich_su_bua_an (user_id, danh_sach_bua_an, thoi_gian) VALUES (?, ?, NOW())',
            [userId, JSON.stringify(items)]
        );

        await db.promise().query('COMMIT');
        res.status(201).json({ message: 'Lưu bữa ăn thành công', mealId });
    } catch (err) {
        await db.promise().query('ROLLBACK');
        console.error('❌ Lỗi lưu bữa ăn:', err);    
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/meals/energy-history', verifyToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const [history] = await db.promise().query(
            `SELECT danh_sach_bua_an, thoi_gian FROM lich_su_bua_an WHERE user_id = ?`,
            [userId]
        );
        const daily = {};
        for (const row of history) {
            const date = row.thoi_gian.toISOString().slice(0, 10);
            const items = JSON.parse(row.danh_sach_bua_an);
            let totalCalo = 0;
            for (const item of items) {
                totalCalo += (parseFloat(item.calo) || 0) * (item.quantity || 1);
            }
            if (!daily[date]) daily[date] = 0;
            daily[date] += totalCalo;
        }
        const result = Object.entries(daily)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([date, consumed]) => ({ date, consumed }));
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/user/profile', verifyToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const [rows] = await db.promise().query(
            'SELECT id, name, email, age, weight, height, gender, goal, allergies FROM user WHERE id = ? LIMIT 1',
            [userId]
        );
        if (!rows.length) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
