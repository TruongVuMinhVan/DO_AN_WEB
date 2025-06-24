const express = require('express');
const db = require('../db');
const jwt = require('jsonwebtoken');
const router = express.Router();
const secretKey = 'your_secret_key';

// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided!' });

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Invalid token!' });
        req.userId = decoded.id;
        next();
    });
};

// [GET] Get current physical information
router.get('/', authenticateUser, (req, res) => {
    const sql = 'SELECT * FROM physical_info WHERE user_id = ?';
    db.query(sql, [req.userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error querying data' });
        res.json(results[0] || null);
    });
});

// [GET] Get physical information history
router.get('/history', authenticateUser, (req, res) => {
    const sql = 'SELECT * FROM physical_info_history WHERE user_id = ? ORDER BY recorded_at DESC LIMIT 10';
    db.query(sql, [req.userId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error querying history' });
        res.json(results);
    });
});

// [POST] Add/update physical information and save history
router.post('/', authenticateUser, (req, res) => {
    const { height, weight, age, gender, activityLevel } = req.body;

    if (!height || !weight || !age || !gender || !activityLevel) {
        return res.status(400).json({ error: 'Missing input data!' });
    }

    if (height < 100 || height > 250 || weight < 30 || weight > 200 || age < 10 || age > 120) {
        return res.status(400).json({ error: 'Invalid input values!' });
    }

    const heightInM = height / 100;
    const bmi = parseFloat((weight / (heightInM * heightInM)).toFixed(1));
    const bmiCategory = bmi < 18.5
        ? 'Underweight'
        : bmi < 25
            ? 'Normal'
            : bmi < 30
                ? 'Overweight'
                : 'Obese';

    const idealMin = parseFloat((18.5 * heightInM * heightInM).toFixed(1));
    const idealMax = parseFloat((24.9 * heightInM * heightInM).toFixed(1));

    let bmr;
    if (gender === 'Male') {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    const activityMap = { 'Low': 1.2, 'Moderate': 1.55, 'High': 1.725 };
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
        if (err) return res.status(500).json({ error: 'Error checking data' });

        const historyValues = [
            req.userId,
            height,
            weight,
            age,
            gender,
            activityLevel,
            bmi,
            bmiCategory,
            calorieNeed,
            idealMin,
            idealMax,
            new Date().toISOString().slice(0, 19).replace('T', ' ')
        ];

        const afterSave = (err) => {
            if (err) return res.status(500).json({ error: 'Error saving physical information' });

            db.query(sqlHistory, historyValues, (historyErr) => {
                if (historyErr) console.error('❌ Error saving history:', historyErr.message);
                res.json({ message: 'Physical information saved successfully!' });
            });
        };

        if (result.length > 0) {
            db.query(sqlUpdate, [
                height,
                weight,
                age,
                gender,
                activityLevel,
                bmi,
                bmiCategory,
                calorieNeed,
                idealMin,
                idealMax,
                req.userId
            ], afterSave);
        } else {
            db.query(sqlInsert, [
                req.userId,
                height,
                weight,
                age,
                gender,
                activityLevel,
                bmi,
                bmiCategory,
                calorieNeed,
                idealMin,
                idealMax
            ], afterSave);
        }
    });
});

module.exports = router;
