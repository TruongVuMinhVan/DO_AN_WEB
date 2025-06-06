const express = require('express');
const router = express.Router();
const db = require('../db');
const verifyToken = require('../middleware/auth');
const axios = require('axios');

// Ensure OPENROUTER_API_KEY is set in .env

async function getOpenRouterSuggestion(prompt) {
    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'openai/gpt-3.5-turbo', // or another model supported by OpenRouter
                messages: [
                    { role: 'system', content: 'You are a nutrition expert.' },
                    { role: 'user', content: prompt }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.choices[0].message.content;
    } catch (err) {
        console.error('OpenRouter error:', err.response?.data || err.message || err);
        return { error: 'Error generating suggestion from OpenRouter.' };
    }
}

// Simple Vietnamese to English translation for prompt keywords and template
function translatePromptToEnglish(prompt) {
    return prompt
        .replace(/Bạn là chuyên gia dinh dưỡng\./g, 'You are a nutrition expert.')
        .replace(/Dưới đây là các món ăn gần đây của người dùng \(bao gồm thông tin dinh dưỡng\):/g, "Here are the user's recent meals (including nutrition information):")
        .replace(/Tiêu chí chế độ ăn:/g, 'Diet criteria:')
        .replace(/giảm calo/g, 'reduce calories')
        .replace(/giảm chất béo/g, 'reduce fat')
        .replace(/giảm tinh bột/g, 'reduce carbs')
        .replace(/tăng protein/g, 'increase protein')
        .replace(/tìm món ăn lành mạnh/g, 'find healthy meals')
        .replace(/Phân tích các món trên, nhắc nhở nếu có món chưa lành mạnh\./g, '1. Analyze the above meals and remind if there are any unhealthy dishes.')
        .replace(/Giải thích lợi ích sức khỏe hoặc dinh dưỡng khi sử dụng món đó\./g, '2. Explain the health or nutritional benefits of those dishes.')
        .replace(/Đề xuất 3 món ăn lành mạnh hơn, không trùng với các món đã nhập\./g, '3. Suggest 3 healthier dishes, not repeating the above.')
        .replace(/Với mỗi món đề xuất, hãy ghi rõ tên món, thông tin dinh dưỡng cũng như lợi ích khi dùng món đó\./g, 'For each suggestion, provide the dish name, nutrition info, and its benefits.')
        .replace(/Gợi ý thực đơn cho người dùng\./g, 'Suggest a menu for the user.')
        .replace(/Trả về kết quả dạng văn bản dễ đọc cho người dùng\./g, 'Return the result in a user-friendly English text.');
}

router.post('/', verifyToken, async (req, res) => {
    const { criteria } = req.body;
    const userId = req.user.id;

    if (!criteria) {
        return res.status(400).json({ error: 'Missing diet criteria.' });
    }

    try {
        // Get 5 most recent meals, JOIN with food and nutrition info
        const [meals] = await db.promise().query(
            `SELECT ma.id AS mon_an_id, ma.ten_mon, ttdn.calo, ttdn.protein, ttdn.carb, ttdn.fat
             FROM lich_su_bua_an lsba
             JOIN mon_an ma ON JSON_EXTRACT(lsba.danh_sach_bua_an, '$[*].food_name') LIKE CONCAT('%', ma.ten_mon, '%')
             LEFT JOIN thong_tin_dinh_duong ttdn ON ma.id = ttdn.mon_an_id
             WHERE lsba.user_id = ?
             ORDER BY lsba.date DESC
             LIMIT 5`,
            [userId]
        );

        if (!meals.length) {
            return res.status(200).send('No recent meal data.');
        }

        const foodsWithNutrition = meals.map(row => ({
            mon_an_id: row.mon_an_id,
            food_name: row.ten_mon,
            calo: row.calo,
            protein: row.protein,
            carb: row.carb,
            fat: row.fat
        }));

        const goals = [];
        if (criteria.reduceCalories) goals.push('giảm calo');
        if (criteria.reduceFat) goals.push('giảm chất béo');
        if (criteria.reduceCarbs) goals.push('giảm tinh bột');
        if (criteria.increaseProtein) goals.push('tăng protein');
        if (goals.length === 0) goals.push("tìm món ăn lành mạnh");

        const foodsText = JSON.stringify(foodsWithNutrition, null, 2);
        let prompt = `Bạn là chuyên gia dinh dưỡng. Dưới đây là các món ăn gần đây của người dùng (bao gồm thông tin dinh dưỡng):
${foodsText}

Tiêu chí chế độ ăn: ${goals.join(', ')}

1. Phân tích các món trên, nhắc nhở nếu có món chưa lành mạnh.
2. Giải thích lợi ích sức khỏe hoặc dinh dưỡng khi sử dụng món đó.
3. Đề xuất 3 món ăn lành mạnh hơn, không trùng với các món đã nhập.
   Với mỗi món đề xuất, hãy ghi rõ tên món, thông tin dinh dưỡng cũng như lợi ích khi dùng món đó.
   Gợi ý thực đơn cho người dùng.
   Trả về kết quả dạng văn bản dễ đọc cho người dùng.`;

        // Translate prompt to English
        prompt = translatePromptToEnglish(prompt);

        const openRouterResponse = await getOpenRouterSuggestion(prompt);

        if (typeof openRouterResponse === 'string') {
            return res.send(openRouterResponse);
        } else {
            return res.status(500).json(openRouterResponse);
        }

    } catch (err) {
        console.error('DB error:', err);
        return res.status(500).json({ error: 'Database query error.' });
    }
});

module.exports = router;