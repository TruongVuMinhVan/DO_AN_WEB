const express = require('express');
const router = express.Router();
const db = require('../db'); // hoặc đường dẫn tới module DB bạn dùng

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

module.exports = router;
