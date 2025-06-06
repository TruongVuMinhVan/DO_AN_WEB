const express = require('express');
const router = express.Router();
const axios = require('axios');

// Sử dụng OpenRouter.ai thay cho Gemini
async function getOpenRouterExplanation(prompt) {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo', 
        messages: [
          { role: 'system', content: 'Bạn là chuyên gia dinh dưỡng.' },
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
    console.error('Lỗi OpenRouter:', err.response?.data || err.message || err);
    return { error: 'Lỗi khi tạo giải thích từ OpenRouter.' };
  }
}

router.post('/', async (req, res) => {
  const { food_name, current_goals } = req.body;

  if (!food_name || !current_goals) {
    return res.status(400).json({ error: 'Thiếu tên món ăn hoặc tiêu chí mục tiêu.' });
  }

  const goals = [];
  if (current_goals.reduceCalories) goals.push('giảm calo');
  if (current_goals.reduceFat) goals.push('giảm chất béo');
  if (current_goals.reduceCarbs) goals.push('giảm tinh bột');
  if (current_goals.increaseProtein) goals.push('tăng protein');
  if (goals.length === 0) goals.push('ăn lành mạnh');

  const prompt = `
Hãy giải thích tại sao món ăn "${food_name}" là lựa chọn lành mạnh, dựa trên các mục tiêu sau: ${goals.join(', ')}.
Câu trả lời ngắn gọn, dễ hiểu cho người dùng phổ thông.
`;

  const openRouterResponse = await getOpenRouterExplanation(prompt);

  if (typeof openRouterResponse === 'string') {
    return res.json({ explanation: openRouterResponse });
  } else {
    return res.status(500).json(openRouterResponse);
  }
});

module.exports = router;