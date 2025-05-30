const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');
const fetch = require('node-fetch'); 

async function fetchNutritionix(foodName) {
    const APP_ID = '54ad9056';
    const API_KEY = 'fc86a343882b8a1f25a02bbd028f6c1c';
    const url = 'https://trackapi.nutritionix.com/v2/natural/nutrients';

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'x-app-id': APP_ID,
            'x-app-key': API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: `100g ${foodName}` }), // 👈 Thêm 100g vào query
    });

    const data = await res.json();
    console.log('👉 Raw response from Nutritionix:', data); // 👈 log toàn bộ phản hồi

    if (!data.foods || !data.foods.length) throw new Error('No nutrition data found');

    const apiFood = data.foods[0];
    console.log('✅ Dữ liệu từng mục:', {
        name: apiFood.food_name,
        serving_weight_grams: apiFood.serving_weight_grams,
        calories: apiFood.nf_calories,
        protein: apiFood.nf_protein,
        fat: apiFood.nf_total_fat,
        carbs: apiFood.nf_total_carbohydrate,
    });

    return {
        calo: apiFood.nf_calories,
        protein: apiFood.nf_protein,
        carb: apiFood.nf_total_carbohydrate,
        fat: apiFood.nf_total_fat,
        serving_weight_grams: apiFood.serving_weight_grams,
    };
}

// Lấy hoặc insert món ăn và trả về mon_an_id
async function getOrCreateMonAnId(food_name) {
    const [[found]] = await db.promise().query(
        'SELECT id FROM mon_an WHERE ten_mon = ? LIMIT 1',
        [food_name]
    );

    if (found) return found.id;

    const [inserted] = await db.promise().query(
        'INSERT INTO mon_an (ten_mon) VALUES (?)',
        [food_name]
    );
    return inserted.insertId;
}

// Lấy hoặc fetch thông tin dinh dưỡng cho 100g
async function getOrFetchNutrition(monAnId, food_name) {
    const [[row]] = await db.promise().query(
        'SELECT calo, protein, carb, fat FROM thong_tin_dinh_duong WHERE mon_an_id = ? LIMIT 1',
        [monAnId]
    );

    if (row) return row;

    try {
        const fetched = await fetchNutritionix(food_name);

        await db.promise().query(
            `INSERT INTO thong_tin_dinh_duong (mon_an_id, calo, protein, carb, fat)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               calo = VALUES(calo),
               protein = VALUES(protein),
               carb = VALUES(carb),
               fat = VALUES(fat)`,
            [monAnId, fetched.calo, fetched.protein, fetched.carb, fetched.fat]
        );

        return fetched;
    } catch (err) {
        console.error('Lỗi fetchNutrition:', err);
        return { calo: 0, protein: 0, carb: 0, fat: 0 };
    }
}

// Lấy report từ lịch sử bữa ăn
router.get('/meals/report', verifyToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const [history] = await db.promise().query(
            `SELECT danh_sach_bua_an, date FROM lich_su_bua_an WHERE user_id = ? ORDER BY date DESC`,
            [userId]
        );

        let result = [];
        for (const row of history) {
            const items = JSON.parse(row.danh_sach_bua_an);
            for (const item of items) {
                result.push({
                    ...item,
                    date: row.date
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
    const { items, date } = req.body;

    if (!Array.isArray(items) || !items.length) {
        return res.status(400).json({ message: 'Chưa có món ăn nào để lưu.' });
    }

    try {
        await db.promise().query('START TRANSACTION');

        const [mealInsert] = await db.promise().query(
            'INSERT INTO bua_an (user_id, date) VALUES (?, ?)',
            [userId, date ? date + ' 00:00:00' : new Date()]
        );
        const mealId = mealInsert.insertId;

        const lich_su_items = [];

        for (let item of items) {
            const { food_name, quantity, custom_weight } = item;

            let [[found]] = await db.promise().query(
                'SELECT id FROM mon_an WHERE ten_mon = ? LIMIT 1',
                [food_name]
            );
            let monAnId = found ? found.id : null;
            if (!monAnId) {
                const [inserted] = await db.promise().query(
                    'INSERT INTO mon_an (ten_mon) VALUES (?)',
                    [food_name]
                );
                monAnId = inserted.insertId;
            }

            await db.promise().query(
                'INSERT INTO mon_an_bua_an (bua_an_id, mon_an_id, quantity, custom_weight) VALUES (?, ?, ?, ?)',
                [mealId, monAnId, quantity, custom_weight || null]
            );

            let [nutriRows] = await db.promise().query(
                'SELECT calo, protein, carb, fat FROM thong_tin_dinh_duong WHERE mon_an_id = ? LIMIT 1',
                [monAnId]
            );

            let nutri;
            if (!nutriRows.length) {
                try {
                    nutri = await fetchNutritionix(food_name);
                    await db.promise().query(
                        `INSERT INTO thong_tin_dinh_duong (mon_an_id, calo, protein, carb, fat)
                         VALUES (?, ?, ?, ?, ?)`,
                        [monAnId, nutri.calo, nutri.protein, nutri.carb, nutri.fat]
                    );
                } catch {
                    nutri = { calo: 0, protein: 0, carb: 0, fat: 0 };
                }
            } else {
                nutri = nutriRows[0];
            }

            const weight = custom_weight || 100;
            const factor = (weight * quantity) / 100;

            await db.promise().query(
                `INSERT INTO thong_tin_dinh_duong_bua_an (bua_an_id, mon_an_id, calo, protein, carb, fat)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    mealId,
                    monAnId,
                    nutri.calo * factor,
                    nutri.protein * factor,
                    nutri.carb * factor,
                    nutri.fat * factor
                ]
            );

            lich_su_items.push({ food_name, quantity, custom_weight });
        }

        await db.promise().query(
            'INSERT INTO lich_su_bua_an (user_id, danh_sach_bua_an, date) VALUES (?, ?, ?)',
            [userId, JSON.stringify(lich_su_items), date ? date + ' 00:00:00' : new Date()]
        );

        await db.promise().query('COMMIT');
        res.status(201).json({ message: 'Lưu bữa ăn thành công', mealId });
    } catch (err) {
        await db.promise().query('ROLLBACK');
        console.error('Lỗi khi lưu bữa ăn:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// PUT /meals - Cập nhật hoặc tạo mới bữa ăn và thông tin dinh dưỡng
router.put('/meals', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { date, items } = req.body;
    if (!date || !Array.isArray(items)) {
        return res.status(400).json({ message: 'Thiếu date hoặc items không hợp lệ' });
    }

    try {
        const [[exists]] = await db.promise().query(
            'SELECT id FROM lich_su_bua_an WHERE user_id = ? AND DATE(`date`) = ?',
            [userId, date]
        );

        const simplifiedItems = items.map(item => ({
            food_name: item.food_name,
            quantity: item.quantity,
            custom_weight: item.custom_weight || null
        }));

        if (exists) {
            await db.promise().query(
                'UPDATE lich_su_bua_an SET danh_sach_bua_an = ?, `date` = ? WHERE id = ?',
                [JSON.stringify(simplifiedItems), date + ' 00:00:00', exists.id]
            );
        } else {
            await db.promise().query(
                'INSERT INTO lich_su_bua_an (user_id, danh_sach_bua_an, `date`) VALUES (?, ?, ?)',
                [userId, JSON.stringify(simplifiedItems), date + ' 00:00:00']
            );
        }

        const [[mealRow]] = await db.promise().query(
            'SELECT id FROM bua_an WHERE user_id = ? AND DATE(`date`) = ?',
            [userId, date]
        );

        if (mealRow) {
            const mealId = mealRow.id;

            await db.promise().query('DELETE FROM mon_an_bua_an WHERE bua_an_id = ?', [mealId]);
            await db.promise().query('DELETE FROM thong_tin_dinh_duong_bua_an WHERE bua_an_id = ?', [mealId]);

            for (let item of items) {
                const [rows] = await db.promise().query(
                    'SELECT id FROM mon_an WHERE ten_mon = ? LIMIT 1',
                    [item.food_name]
                );
                if (!rows.length) continue;
                const monAnId = rows[0].id;

                await db.promise().query(
                    'INSERT INTO mon_an_bua_an (bua_an_id, mon_an_id, quantity, custom_weight) VALUES (?, ?, ?, ?)',
                    [mealId, monAnId, item.quantity, item.custom_weight || null]
                );

                const [[nutri]] = await db.promise().query(
                    'SELECT calo, protein, carb, fat FROM thong_tin_dinh_duong WHERE mon_an_id = ?',
                    [monAnId]
                );
                if (!nutri) continue;

                const weight = item.custom_weight ?? 100;
                const quantity = item.quantity ?? 1;

                const weightRatio = (weight * quantity) / 100;

                await db.promise().query(
                    `INSERT INTO thong_tin_dinh_duong_bua_an (bua_an_id, mon_an_id, calo, protein, carb, fat)
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        mealId,
                        monAnId,
                        nutri.calo * weightRatio,
                        nutri.protein * weightRatio,
                        nutri.carb * weightRatio,
                        nutri.fat * weightRatio
                    ]
                );
            }
        }

        return res.json({ message: 'Cập nhật bữa ăn thành công' });

    } catch (err) {
        console.error('Lỗi PUT /api/meals:', err);
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// routes/meal.js (hoặc file tương ứng)
router.get('/meals', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { date } = req.query; // ví dụ '2025-05-23'
    try {
        const sql = `
      SELECT danh_sach_bua_an
      FROM lich_su_bua_an
      WHERE user_id = ? AND DATE(date) = ?
      ORDER BY date DESC
      LIMIT 1
    `;
        const [rows] = await db.promise().query(sql, [userId, date]);

        if (rows.length) {
            // parses JSON string từ cột danh_sach_bua_an
            const items = JSON.parse(rows[0].danh_sach_bua_an);
            return res.json({ items });
        }
        // chưa có bữa ăn nào
        return res.json({ items: [] });
    } catch (err) {
        console.error('❌ Lỗi GET /api/meals:', err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
});

router.get('/meals/energy-history', verifyToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const [history] = await db.promise().query(
            `SELECT danh_sach_bua_an, date FROM lich_su_bua_an WHERE user_id = ?`,
            [userId]
        );
        const daily = {};
        for (const row of history) {
            const date = row.date.toISOString().slice(0, 10);
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

