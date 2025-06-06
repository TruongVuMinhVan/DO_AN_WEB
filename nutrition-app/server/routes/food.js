
const express = require('express');
const router = express.Router();
const db = require('../db'); // hoặc đường dẫn tới module DB bạn dùng
const verifyToken = require('../middleware/auth');   // ← Thêm import này
const fetch = require('node-fetch');

// ...existing code...
async function fetchNutritionix(foodName) {
    const APP_ID = process.env.NUTRITIONIX_APP_ID;
    const API_KEY = process.env.NUTRITIONIX_API_KEY;
    const url = 'https://trackapi.nutritionix.com/v2/natural/nutrients';

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'x-app-id': APP_ID,
            'x-app-key': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: `100g ${foodName}` })
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Nutritionix API lỗi ${res.status}: ${text}`);
    }
    const { foods } = await res.json();
    if (!foods?.length) throw new Error('No nutrition data found');
    const apiFood = foods[0];
    return {
        food_name: apiFood.food_name,
        serving_weight_grams: apiFood.serving_weight_grams || 100,
        nf_calories: apiFood.nf_calories,
        nf_protein: apiFood.nf_protein,
        nf_total_carbohydrate: apiFood.nf_total_carbohydrate,
        nf_total_fat: apiFood.nf_total_fat
    };
}

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.promise().query(
            'SELECT id, ten_mon FROM mon_an ORDER BY ten_mon'
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

router.post('/fetch', verifyToken, async (req, res) => {
    const { food_name, weight } = req.body; // weight luôn 100
    try {
        const apiFood = await fetchNutritionix(`100g ${food_name}`);
        // fetchNutritionix trả về { serving_weight_grams:100, nf_calories, nf_protein, ... }

        return res.json({
            food_name: apiFood.food_name,
            serving_weight_grams: apiFood.serving_weight_grams,
            nf_calories: apiFood.nf_calories,
            nf_protein: apiFood.nf_protein,
            nf_total_carbohydrate: apiFood.nf_total_carbohydrate,
            nf_total_fat: apiFood.nf_total_fat
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching nutrition data' });
    }
});

module.exports = router;
