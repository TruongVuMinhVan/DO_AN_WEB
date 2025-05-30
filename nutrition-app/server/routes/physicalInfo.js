const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');
const router = express.Router();
const secretKey = 'your_secret_key';

// Middleware xác thực người dùng
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Không có token!' });

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token không hợp lệ!' });
    req.userId = decoded.id;
    next();
  });
};

// [GET] Lấy thông tin thể chất hiện tại
router.get('/', authenticateUser, (req, res) => {
  const sql = 'SELECT * FROM physical_info WHERE user_id = ?';
  db.query(sql, [req.userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi truy vấn dữ liệu' });
    res.json(results[0] || null);
  });
});

// [GET] Lấy lịch sử thể chất
router.get('/history', authenticateUser, (req, res) => {
  const sql = 'SELECT * FROM physical_info_history WHERE user_id = ? ORDER BY recorded_at DESC LIMIT 10';
  db.query(sql, [req.userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi khi truy vấn lịch sử' });
    res.json(results);
  });
});

// [POST] Thêm/cập nhật thông tin thể chất và lưu lịch sử
router.post('/', authenticateUser, (req, res) => {
  const { height, weight, age, gender, activityLevel } = req.body;

  if (!height || !weight || !age || !gender || !activityLevel) {
    return res.status(400).json({ error: 'Thiếu dữ liệu đầu vào!' });
  }

  if (height < 100 || height > 250 || weight < 30 || weight > 200 || age < 10 || age > 120) {
    return res.status(400).json({ error: 'Giá trị đầu vào không hợp lệ!' });
  }

  const heightInM = height / 100;
  const bmi = parseFloat((weight / (heightInM * heightInM)).toFixed(1));
  const bmiCategory = bmi < 18.5 ? 'Thiếu cân' : bmi < 25 ? 'Bình thường' : bmi < 30 ? 'Thừa cân' : 'Béo phì';
  const idealMin = parseFloat((18.5 * heightInM * heightInM).toFixed(1));
  const idealMax = parseFloat((24.9 * heightInM * heightInM).toFixed(1));

  let bmr = gender === 'Nam'
    ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);

  const activityMap = { 'Ít': 1.2, 'Trung bình': 1.55, 'Nhiều': 1.725 };
  const calorieNeed = Math.round(bmr * (activityMap[activityLevel] || 1.2));

  const sqlCheck = 'SELECT * FROM physical_info WHERE user_id = ?';
  const sqlInsert = `
    INSERT INTO physical_info 
    (user_id, height, weight, age, gender, activity_level, bmi, bmi_category, calorie_need, ideal_weight_min, ideal_weight_max) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const sqlUpdate = `
    UPDATE physical_info SET 
    height = ?, weight = ?, age = ?, gender = ?, activity_level = ?, 
    bmi = ?, bmi_category = ?, calorie_need = ?, ideal_weight_min = ?, ideal_weight_max = ? 
    WHERE user_id = ?
  `;
  const sqlHistory = `
    INSERT INTO physical_info_history 
    (user_id, height, weight, age, gender, activity_level, bmi, bmi_category, calorie_need, ideal_weight_min, ideal_weight_max, recorded_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sqlCheck, [req.userId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi kiểm tra dữ liệu' });

    const historyValues = [
      req.userId, height, weight, age, gender, activityLevel,
      bmi, bmiCategory, calorieNeed, idealMin, idealMax,
      new Date().toISOString().slice(0, 19).replace('T', ' ')
    ];

    const updateOrInsert = result.length > 0
      ? () => db.query(sqlUpdate, [
          height, weight, age, gender, activityLevel,
          bmi, bmiCategory, calorieNeed, idealMin, idealMax,
          req.userId
        ], afterSave)
      : () => db.query(sqlInsert, [
          req.userId, height, weight, age, gender, activityLevel,
          bmi, bmiCategory, calorieNeed, idealMin, idealMax
        ], afterSave);

    const afterSave = (err) => {
      if (err) return res.status(500).json({ error: 'Lỗi khi lưu thông tin thể chất' });

      db.query(sqlHistory, historyValues, (historyErr) => {
        if (historyErr) console.error('❌ Lỗi khi lưu lịch sử:', historyErr.message);
        res.json({ message: '✅ Lưu thông tin thể chất thành công!' });
      });
    };

    updateOrInsert();
  });
});

module.exports = router;
