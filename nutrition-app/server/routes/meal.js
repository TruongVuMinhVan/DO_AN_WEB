const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth'); // Middleware xác thực token
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
    const { items } = req.body;  // items = [{ food_name, quantity }, ...]
    if (!Array.isArray(items) || !items.length) {
        return res.status(400).json({ message: 'Chưa có món ăn nào để lưu.' });
    }

    try {
        // Thêm thông tin dinh dưỡng vào từng item
        for (let item of items) {
            // Tìm hoặc tạo mon_an
            const [rows] = await db.promise().query(
                'SELECT id FROM mon_an WHERE ten_mon = ? LIMIT 1',
                [item.food_name]
            );
            let monAnId;
            if (rows.length) {
                monAnId = rows[0].id;
            } else {
                const [ins] = await db.promise().query(
                    'INSERT INTO mon_an (ten_mon) VALUES (?)',
                    [item.food_name]
                );
                monAnId = ins.insertId;
            }

            // Lấy hoặc tạo thông tin dinh dưỡng
            let [nutriRows] = await db.promise().query(
                'SELECT calo, protein, carb, fat FROM thong_tin_dinh_duong WHERE mon_an_id = ? LIMIT 1',
                [monAnId]
            );
            let nutri;
            if (!nutriRows.length) {
                try {
                    nutri = await fetchNutritionix(item.food_name);
                    await db.promise().query(
                        `INSERT INTO thong_tin_dinh_duong (mon_an_id, calo, protein, carb, fat)
                         VALUES (?, ?, ?, ?, ?)`,
                        [
                            monAnId,
                            nutri.nf_calories,
                            nutri.nf_protein,
                            nutri.nf_total_carbohydrate,
                            nutri.nf_total_fat
                        ]
                    );
                } catch (err) {
                    console.warn(`⚠️ Không thể lấy dinh dưỡng cho ${item.food_name}:`, err.message);
                    nutri = { nf_calories: 0, nf_protein: 0, nf_total_carbohydrate: 0, nf_total_fat: 0 };
                }
            } else {
                nutri = {
                    nf_calories: nutriRows[0].calo,
                    nf_protein: nutriRows[0].protein,
                    nf_total_carbohydrate: nutriRows[0].carb,
                    nf_total_fat: nutriRows[0].fat
                };
            }

            // Gán dinh dưỡng vào item
            item.calo = nutri.nf_calories;
            item.protein = nutri.nf_protein;
            item.carb = nutri.nf_total_carbohydrate;
            item.fat = nutri.nf_total_fat;
        }

        // Lưu vào lich_su_bua_an (lúc này items đã có đủ dinh dưỡng)
        await db.promise().query(
            'INSERT INTO lich_su_bua_an (user_id, danh_sach_bua_an, thoi_gian) VALUES (?, ?, NOW())',
            [userId, JSON.stringify(items)]
        );

        res.status(201).json({ message: 'Saved meal successfully' });
    } catch (err) {
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
// Gợi ý món ăn lành mạnh hơn
router.post('/foods/suggest-healthier', verifyToken, async (req, res) => {
    const { food_name, currentNutrition, userGoal } = req.body;
    if (!food_name || !currentNutrition) {
        return res.status(400).json({ message: 'Thiếu thông tin món ăn hoặc dinh dưỡng hiện tại.' });
    }

    try {
        // Gọi Nutritionix để tìm các món tương tự
        const APP_ID = '54ad9056';
        const API_KEY = 'fc86a343882b8a1f25a02bbd028f6c1c';
        const searchRes = await fetch(`https://trackapi.nutritionix.com/v2/search/instant?query=${encodeURIComponent(food_name)}`, {
            headers: {
                'x-app-id': APP_ID,
                'x-app-key': API_KEY
            }
        });
        const searchData = await searchRes.json();
        const commonFoods = searchData.common.slice(0, 5); // Lấy 5 món tương tự

        const suggestions = [];

        // Gọi dinh dưỡng chi tiết từng món
        for (const food of commonFoods) {
            const nutriRes = await fetch(`https://trackapi.nutritionix.com/v2/natural/nutrients`, {
                method: 'POST',
                headers: {
                    'x-app-id': APP_ID,
                    'x-app-key': API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: food.food_name })
            });
            const nutriData = await nutriRes.json();
            if (!nutriData.foods || !nutriData.foods.length) continue;

            const f = nutriData.foods[0];
            const isHealthier =
                f.nf_calories < currentNutrition.calo &&
                f.nf_total_fat < currentNutrition.fat &&
                f.nf_protein >= currentNutrition.protein * 0.8;

            if (isHealthier) {
                suggestions.push({
                    food_name: f.food_name,
                    photo: f.photo?.thumb,
                    calo: f.nf_calories,
                    protein: f.nf_protein,
                    fat: f.nf_total_fat,
                    carb: f.nf_total_carbohydrate
                });
            }
        }

        if (!suggestions.length) {
            return res.json({ message: 'Không tìm thấy món thay thế lành mạnh hơn.' });
        }

        res.json({ suggestions });
    } catch (err) {
        console.error('Lỗi khi đề xuất món ăn:', err);
        res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
});


module.exports = router;