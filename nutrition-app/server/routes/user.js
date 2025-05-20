const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";
<<<<<<< HEAD
const multer = require('multer');
const path = require('path');

=======
>>>>>>> f217226a2968b9de084227ab6b12b5c643e17947

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
<<<<<<< HEAD
=======
// POST /api/register
>>>>>>> f217226a2968b9de084227ab6b12b5c643e17947
router.post("/register", async (req, res) => {
    const { name, email, password, age, weight, height, gender } = req.body;
    if (!name || !email || !password || !age || !weight || !height || !gender) {
        return res.status(400).json({ error: "Vui lòng nhập đầy đủ tất cả thông tin." });
    }
<<<<<<< HEAD

    try {
        // Hash mật khẩu
        const hash = await bcrypt.hash(password, 10);

        // Đường dẫn avatar mặc định (file default.png nằm trong public/avatars)
        const defaultAvatar = "/avatars/default.png";

        // Chèn thêm cột avatarUrl
        const sql = `
      INSERT INTO user
        (name, email, password, age, weight, height, gender, avatarUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
        db.query(
            sql,
            [name, email, hash, age, weight, height, gender, defaultAvatar],
            (err, result) => {
                if (err) {
                    console.error("❌ Lỗi khi thêm người dùng:", err.message);
                    return res.status(500).json({ error: "Đăng ký thất bại.", details: err.message });
                }
                res.status(201).json({
                    message: "Đăng ký thành công!",
                    userId: result.insertId
                });
            }
        );
=======
    try {
        const hash = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO user (name, email, password, age, weight, height, gender)
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [name, email, hash, age, weight, height, gender], (err, result) => {
            if (err) {
                console.error("❌ Lỗi khi thêm người dùng:", err.message);
                return res.status(500).json({ error: "Đăng ký thất bại.", details: err.message });
            }
            res.status(201).json({ message: "Đăng ký thành công!", userId: result.insertId });
        });
>>>>>>> f217226a2968b9de084227ab6b12b5c643e17947
    } catch (e) {
        console.error("❌ Hash error:", e.message);
        res.status(500).json({ error: "Lỗi khi mã hóa mật khẩu" });
    }
});

// Đăng nhập
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM user WHERE email = ?", [email], async (err, rows) => {
        if (err) return res.status(500).json({ message: "Lỗi server" });
        if (rows.length === 0) return res.status(401).json({ message: "Email không tồn tại" });
        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Sai mật khẩu" });
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token });
    });
});

router.get("/profile", verifyToken, (req, res) => {
    const userId = req.user.id;
<<<<<<< HEAD
    const sql = `
    SELECT id, name, email, age, weight, height, gender, goal, allergies, avatarUrl
    FROM user
    WHERE id = ?
  `;
=======
    const sql = `SELECT id, name, email, age, gender, goal, allergies 
               FROM user WHERE id = ?`;
>>>>>>> f217226a2968b9de084227ab6b12b5c643e17947
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!results.length) return res.status(404).json({ message: "User not found" });
        res.json(results[0]);
    });
});

// Cập nhật profile (không password)
router.put("/profile", verifyToken, (req, res) => {
    const userId = req.user.id;
    const { name, email, age, gender, goal, allergies } = req.body;
<<<<<<< HEAD
    const sql = `
    SELECT id, name, email, age, weight, height, gender, goal, allergies, avatarUrl
    FROM user
    WHERE id = ?
  `;
=======
    const sql = `UPDATE user 
               SET name=?, email=?, age=?, gender=?, goal=?, allergies=? 
               WHERE id=?`;
>>>>>>> f217226a2968b9de084227ab6b12b5c643e17947
    db.query(sql, [name, email, age, gender, goal, allergies, userId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Profile updated" });
    });
});

router.put("/profile/password", verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Both old and new passwords are required" });
    }

    try {
        db.query("SELECT password FROM user WHERE id = ?", [userId], async (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!results.length) return res.status(404).json({ message: "User not found" });

            const currentHash = results[0].password;

            let match;
            try {
                if (!currentHash || typeof currentHash !== 'string') {
                    throw new Error("Invalid password hash from DB");
                }
                match = await bcrypt.compare(oldPassword, currentHash);
            } catch (err) {
                console.error("Compare error:", err.message);
                return res.status(500).json({ message: "Error comparing passwords" });
            }

            if (!match) {
                return res.status(403).json({ message: "Old password is incorrect" });
            }

            try {
                const newHash = await bcrypt.hash(newPassword, 10);
                db.query("UPDATE user SET password = ? WHERE id = ?", [newHash, userId], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    return res.json({ message: "Password changed successfully" });
                });
            } catch (err) {
                return res.status(500).json({ message: "Error hashing new password" });
            }
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        return res.status(500).json({ message: "Unexpected server error" });
    }
});

router.delete('/profile', verifyToken, (req, res) => {
    const userId = req.user.id;
    console.log("🧠 User nhận được từ token:", req.user);
    const sql = "DELETE FROM user WHERE id = ?";
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("❌ Xoá thất bại:", err.message);
            return res.status(500).json({ message: 'Xoá tài khoản thất bại', details: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy người dùng để xoá" });
        }

        res.status(200).json({ message: 'Tài khoản đã được xoá' });
    });
});

<<<<<<< HEAD
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../public/avatars')),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `avatar_${req.user.id}${ext}`);
    }
});
const upload = multer({ storage });

// POST /api/profile/avatar
router.post('/profile/avatar', verifyToken, upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Chưa chọn file' });

  const avatarUrl = `/avatars/${req.file.filename}`;
  db.query('UPDATE user SET avatarUrl = ? WHERE id = ?', [avatarUrl, req.user.id], (err) => {
    if (err) {
      console.error('Lỗi cập nhật avatarUrl:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ avatarUrl });
  });
});
=======
>>>>>>> f217226a2968b9de084227ab6b12b5c643e17947

module.exports = router; 
