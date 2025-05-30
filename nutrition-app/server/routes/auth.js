const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');
const verifyToken = require('../middleware/auth'); // Middleware xác thực token
const router = express.Router();
const SECRET_KEY = "your_secret_key"; // 🔑 Thay thế bằng key bảo mật thực tế

// 📌 [POST] Đăng ký người dùng mới
router.post('/register', async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: '❌ Vui lòng điền đầy đủ thông tin!' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // 🔒 Băm mật khẩu trước khi lưu
        const sqlInsert = 'INSERT INTO user (email, password, name) VALUES (?, ?, ?)';
        db.query(sqlInsert, [email, hashedPassword, name], (err) => {
            if (err) return res.status(500).json({ error: '❌ Lỗi khi đăng ký!' });
            res.json({ message: '✅ Đăng ký thành công!' });
        });
    } catch (err) {
        res.status(500).json({ error: '❌ Lỗi xử lý đăng ký!' });
    }
});

// 🔐 [POST] Đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: '❌ Thiếu email hoặc mật khẩu!' });
    }

    try {
        const sql = 'SELECT id, email, password FROM user WHERE email = ?';
        db.query(sql, [email], async (err, results) => {
            if (err) return res.status(500).json({ error: '❌ Lỗi server!' });
            if (results.length === 0) return res.status(401).json({ error: '❌ Email không tồn tại!' });

            const user = results[0];
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) return res.status(401).json({ error: '❌ Sai mật khẩu!' });

            const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' }); // 🔑 Token hết hạn sau 1 giờ
            res.json({ message: '✅ Đăng nhập thành công!', token });
        });
    } catch (err) {
        res.status(500).json({ error: '❌ Lỗi xử lý đăng nhập!' });
    }
});

// 👤 [GET] Lấy thông tin cá nhân của user đăng nhập
router.get('/profile', verifyToken, (req, res) => {
    const sql = 'SELECT id, email, name FROM user WHERE id = ?';
    db.query(sql, [req.userId], (err, results) => {
        if (err) return res.status(500).json({ error: '❌ Lỗi khi lấy thông tin user!' });
        res.json(results[0] || {});
    });
});

module.exports = router;
