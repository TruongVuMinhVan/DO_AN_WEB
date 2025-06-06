const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');
const fetch = require('node-fetch'); 

async function fetchNutritionix(foodName) {
    const APP_ID = '80ee36fb';
    const API_KEY = '9af2d3d982a7b28c2a4beac4e634ef99';
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
router.post("/meals", verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { date, items } = req.body;

    if (!date || !Array.isArray(items) || items.length === 0) {
        return res
            .status(400)
            .json({ message: "Thiếu date hoặc items không hợp lệ" });
    }

    try {
        await db.promise().query("START TRANSACTION");

        // 1) Tạo bữa ăn (bua_an)
        const [buaAnResult] = await db.promise().query(
            "INSERT INTO bua_an (user_id, date) VALUES (?, ?)",
            [userId, `${date} 00:00:00`]
        );
        const mealId = buaAnResult.insertId;

        // Mảng để lưu lịch sử (chỉ cần food_name, quantity, custom_weight)
        const lichSuItems = [];

        // 2) Với mỗi item, kiểm tra/insert mon_an, rồi insert mon_an_bua_an và thong_tin_dinh_duong_bua_an
        for (let item of items) {
            // Chỉ lấy 3 field quan trọng
            const foodName = item.food_name;
            const quantity = item.quantity || 1;
            const customWeight = item.custom_weight || 100; // nếu null thì mặc định 100

            if (!foodName) continue;

            // 2a) Lấy hoặc tạo mon_an (bảng mon_an) để lấy monAnId
            let [[found]] = await db.promise().query(
                "SELECT id FROM mon_an WHERE ten_mon = ? LIMIT 1",
                [foodName]
            );
            let monAnId;
            if (found) {
                monAnId = found.id;
            } else {
                const [ins] = await db.promise().query(
                    "INSERT INTO mon_an (ten_mon) VALUES (?)",
                    [foodName]
                );
                monAnId = inserted.insertId;
            }

            // 2b) Insert vào mon_an_bua_an (liên kết bữa ăn – món ăn)
            await db.promise().query(
                "INSERT INTO mon_an_bua_an (bua_an_id, mon_an_id, quantity, custom_weight) VALUES (?, ?, ?, ?)",
                [mealId, monAnId, quantity, customWeight]
            );

            // 2c) Lấy thông tin dinh dưỡng gốc cho món (trong 100g) từ bảng thong_tin_dinh_duong
            const [[nutriRow]] = await db.promise().query(
                "SELECT calo, protein, carb, fat FROM thong_tin_dinh_duong WHERE mon_an_id = ? LIMIT 1",
                [monAnId]
            );
            let calo100 = 0,
                protein100 = 0,
                carb100 = 0,
                fat100 = 0;

            if (nutriRow) {
                calo100 = nutriRow.calo;
                protein100 = nutriRow.protein;
                carb100 = nutriRow.carb;
                fat100 = nutriRow.fat;
            } else {
                // Nếu chưa có trong DB thì fetch từ Nutritionix rồi insert vào thong_tin_dinh_duong
                try {
                    const fetched = await fetchNutritionix(foodName);
                    calo100 = fetched.calo;
                    protein100 = fetched.protein;
                    carb100 = fetched.carb;
                    fat100 = fetched.fat;

                    await db.promise().query(
                        `INSERT INTO thong_tin_dinh_duong (mon_an_id, calo, protein, carb, fat)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
               calo = VALUES(calo),
               protein = VALUES(protein),
               carb = VALUES(carb),
               fat = VALUES(fat)`,
                        [monAnId, calo100, protein100, carb100, fat100]
                    );
                } catch (e) {
                    console.error("Fetch nutritionix error:", e);
                    // Để 0 nếu fetch lỗi
                }
            }

            // 2d) Tính trọng số: factor = (customWeight * quantity) / 100
            const factor = (customWeight * quantity) / 100;

            // 2e) Insert vào thong_tin_dinh_duong_bua_an
            await db.promise().query(
                `INSERT INTO thong_tin_dinh_duong_bua_an 
          (bua_an_id, mon_an_id, calo, protein, carb, fat)
         VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    mealId,
                    monAnId,
                    calo100 * factor,
                    protein100 * factor,
                    carb100 * factor,
                    fat100 * factor
                ]
            );

            // Đẩy item gốc (chỉ 3 trường) vào lichSuItems để lưu trong lich_su_bua_an
            lichSuItems.push({ food_name: foodName, quantity, custom_weight: customWeight });
        }

        // 3) Lưu vào lich_su_bua_an (lưu cả JSON của lichSuItems để dùng cho report)
        await db.promise().query(
            "INSERT INTO lich_su_bua_an (user_id, danh_sach_bua_an, date) VALUES (?, ?, ?)",
            [userId, JSON.stringify(lichSuItems), `${date} 00:00:00`]
        );

        await db.promise().query("COMMIT");
        return res.status(201).json({ message: "Lưu bữa ăn thành công", mealId });
    } catch (err) {
        await db.promise().query("ROLLBACK");
        console.error("POST /api/meals error:", err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
});

// PUT /meals - Cập nhật hoặc tạo mới bữa ăn và thông tin dinh dưỡng
router.put("/meals", verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { date, items } = req.body;

    if (!date || !Array.isArray(items)) {
        return res
            .status(400)
            .json({ message: "Thiếu date hoặc items không hợp lệ" });
    }

    try {
        // 1) Kiểm tra trong lich_su_bua_an xem user + date đã có chưa
        const [[exists]] = await db.promise().query(
            `SELECT id 
       FROM lich_su_bua_an 
       WHERE user_id = ? AND DATE(date) = ?
       LIMIT 1`,
            [userId, date]
        );

        // Chuẩn bị simplifiedItems (chỉ 3 field) để lưu vào lich_su_bua_an
        const simplifiedItems = items.map(item => ({
            food_name: item.food_name,
            quantity: item.quantity,
            custom_weight: item.custom_weight
        }));

        if (exists) {
            // 2a) Nếu đã có lịch sử, update danh_sach_bua_an
            await db.promise().query(
                `UPDATE lich_su_bua_an 
         SET danh_sach_bua_an = ?, date = ? 
         WHERE id = ?`,
                [JSON.stringify(simplifiedItems), `${date} 00:00:00`, exists.id]
            );
        } else {
            // 2b) Nếu chưa có, insert mới vào lich_su_bua_an
            await db.promise().query(
                `INSERT INTO lich_su_bua_an (user_id, danh_sach_bua_an, date)
         VALUES (?, ?, ?)`,
                [userId, JSON.stringify(simplifiedItems), `${date} 00:00:00`]
            );
        }

        // 3) Tìm trong bua_an xem có bữa ăn chưa
        const [[mealRow]] = await db.promise().query(
            `SELECT id 
       FROM bua_an 
       WHERE user_id = ? AND DATE(date) = ?
       LIMIT 1`,
            [userId, date]
        );

        if (mealRow) {
            // 4a) Nếu có bữa ăn, lấy mealId
            const mealId = mealRow.id;

            // 5) Xóa hết các mon_an_bua_an và thong_tin_dinh_duong_bua_an cũ của meal này
            await db
                .promise()
                .query("DELETE FROM mon_an_bua_an WHERE bua_an_id = ?", [mealId]);
            await db
                .promise()
                .query("DELETE FROM thong_tin_dinh_duong_bua_an WHERE bua_an_id = ?", [
                    mealId
                ]);

            // 6) Thêm lại tất cả các item mới (giống logic ở POST)
            for (let item of items) {
                const foodName = item.food_name;
                const quantity = item.quantity || 1;
                const customWeight = item.custom_weight || 100;

                // Lấy/insert mon_an để lấy monAnId
                let [[found]] = await db.promise().query(
                    "SELECT id FROM mon_an WHERE ten_mon = ? LIMIT 1",
                    [foodName]
                );
                let monAnId;
                if (found) {
                    monAnId = found.id;
                } else {
                    const [ins] = await db.promise().query(
                        "INSERT INTO mon_an (ten_mon) VALUES (?)",
                        [foodName]
                    );
                    monAnId = ins.insertId;
                }

                // Insert vào mon_an_bua_an
                await db.promise().query(
                    "INSERT INTO mon_an_bua_an (bua_an_id, mon_an_id, quantity, custom_weight) VALUES (?, ?, ?, ?)",
                    [mealId, monAnId, quantity, customWeight]
                );

                // Lấy nutrition gốc
                const [[nutriRow]] = await db.promise().query(
                    "SELECT calo, protein, carb, fat FROM thong_tin_dinh_duong WHERE mon_an_id = ? LIMIT 1",
                    [monAnId]
                );
                let calo100 = 0, protein100 = 0, carb100 = 0, fat100 = 0;
                if (nutriRow) {
                    calo100 = nutriRow.calo;
                    protein100 = nutriRow.protein;
                    carb100 = nutriRow.carb;
                    fat100 = nutriRow.fat;
                } else {
                    // Nếu chưa có, fetch rồi insert
                    try {
                        const fetched = await fetchNutritionix(foodName);
                        calo100 = fetched.calo;
                        protein100 = fetched.protein;
                        carb100 = fetched.carb;
                        fat100 = fetched.fat;

                        await db.promise().query(
                            `INSERT INTO thong_tin_dinh_duong (mon_an_id, calo, protein, carb, fat)
               VALUES (?, ?, ?, ?, ?)
               ON DUPLICATE KEY UPDATE
                 calo = VALUES(calo),
                 protein = VALUES(protein),
                 carb = VALUES(carb),
                 fat = VALUES(fat)`,
                            [monAnId, calo100, protein100, carb100, fat100]
                        );
                    } catch (e) {
                        console.error("Fetch nutritionix error:", e);
                    }
                }

                // Tính factor
                const factor = (customWeight * quantity) / 100;

                // Insert vào thong_tin_dinh_duong_bua_an
                await db.promise().query(
                    `INSERT INTO thong_tin_dinh_duong_bua_an 
             (bua_an_id, mon_an_id, calo, protein, carb, fat)
           VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        mealId,
                        monAnId,
                        calo100 * factor,
                        protein100 * factor,
                        carb100 * factor,
                        fat100 * factor
                    ]
                );
            }

            // 7) Trả về success
            return res.json({ message: "Cập nhật bữa ăn thành công" });
        } else {
            // 8a) Nếu chưa có bữa ăn nào trong bua_an, ta sẽ tạo y hệt giống POST
            await db.promise().query(
                "INSERT INTO bua_an (user_id, date) VALUES (?, ?)",
                [userId, `${date} 00:00:00`]
            );
            // Giống y logic POST, nhưng để gọn tôi sẽ gọi lại POST - Cách nhanh:
            // Chuyển hướng nội bộ sang POST /api/meals để xử lý tiếp
            req.body = { date, items };
            return router.handle(req, res);
        }
    } catch (err) {
        console.error("PUT /api/meals error:", err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
    }
});

// routes/meal.js (hoặc file tương ứng)
router.get("/meals", verifyToken, async (req, res) => {
    const userId = req.user.id;
    const date = req.query.date; // ví dụ '2025-06-06'
    if (!date) {
        return res
            .status(400)
            .json({ message: "Missing date query parameter" });
    }

    try {
        // Lấy record trong lich_su_bua_an (lưu danh_sach_bua_an) của user tại ngày 'date'
        const sql = `
      SELECT danh_sach_bua_an
      FROM lich_su_bua_an
      WHERE user_id = ? AND DATE(date) = ?
      ORDER BY date DESC
      LIMIT 1
    `;
        const [rows] = await db.promise().query(sql, [userId, date]);

        if (rows.length) {
            // các item lúc lưu đã JSON.stringify(...) nên giờ parse lại
            const items = JSON.parse(rows[0].danh_sach_bua_an);
            return res.json({ items });
        }
        return res.json({ items: [] }); // chưa có bữa ăn nào
    } catch (err) {
        console.error("GET /api/meals error:", err);
        return res
            .status(500)
            .json({ message: "Server error", error: err.message });
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

