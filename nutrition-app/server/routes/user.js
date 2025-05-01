const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require('../middleware/auth');

// 🧑 Lấy danh sách người dùng
router.get("/user", (req, res) => {
    db.query("SELECT * FROM user", (err, results) => {
        if (err) {
            console.error("❌ Lỗi truy vấn danh sách user:", err.message);
            return res.status(500).json({ error: "Lỗi khi truy vấn dữ liệu người dùng", details: err.message });
        }
        res.json(results);
    });
});

// 📝 Đăng ký người dùng
router.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "Vui lòng nhập đầy đủ thông tin." });
    }

    const sql = "INSERT INTO user (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, password], (err, result) => {
        if (err) {
            console.error("❌ Lỗi khi thêm người dùng:", err.message);
            return res.status(500).json({ error: "Đăng ký thất bại.", details: err.message });
        }
        res.status(201).json({ message: "Đăng ký thành công!", userId: result.insertId });
    });
});

// 🔐 Đăng nhập
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log('📩 Nhận login:', email, password);

    const sql = "SELECT * FROM user WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error("❌ Lỗi truy vấn đăng nhập:", err.message);
            return res.status(500).json({ message: "Lỗi server", details: err.message });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
        }

        const user = results[0];

        const jwt = require("jsonwebtoken");
        const SECRET_KEY = "your_secret_key";   

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
            expiresIn: "1h",
        });

        res.json({ message: "Đăng nhập thành công", token, user });
    });
});


router.get("/profile", verifyToken, (req, res) => {
    const userId = req.user.id;

    db.query("SELECT id, name, email, age, gender, goal, allergies FROM user WHERE id = ?", [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy người dùng." });
        }

        res.json(results[0]);
    });
});


router.put("/profile", verifyToken, (req, res) => {
    const userId = req.user.id;
    const { name, email, age, gender, goal, allergies } = req.body;

    console.log("🔥 Dữ liệu nhận được:", req.body);

    const sql = `UPDATE user SET name=?, email=?, age=?, gender=?, goal=?, allergies=? WHERE id=?`;
    db.query(sql, [name, email, age, gender, goal, allergies, userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        res.json({ message: "Cập nhật thành công!" });
    });
});

module.exports = router; 
