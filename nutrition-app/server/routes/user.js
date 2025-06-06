const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";
const multer = require('multer');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

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
//router.post("/register", async (req, res) => {
//    const { name, email, password, age, weight, height, gender } = req.body;
//    if (!name || !email || !password || !age || !weight || !height || !gender) {
//        return res.status(400).json({ error: "Vui lòng nhập đầy đủ tất cả thông tin." });
//    }

//    try {
//        const hash = await bcrypt.hash(password, 10);
//        const defaultAvatar = "/avatars/default.png";

//        const sql = `
//            INSERT INTO user (name, email, password, age, weight, height, gender, avatarUrl)
//            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//        `;

//        db.query(sql, [name, email, hash, age, weight, height, gender, defaultAvatar], (err, result) => {
//            if (err) {
//                console.error("❌ Lỗi khi thêm người dùng:", err.message);
//                return res.status(500).json({ error: "Đăng ký thất bại.", details: err.message });
//            }
//            res.status(201).json({
//                message: "Đăng ký thành công!",
//                userId: result.insertId
//            });
//        });
//    } catch (e) {
//        console.error("❌ Hash error:", e.message);
//        res.status(500).json({ error: "Lỗi khi mã hóa mật khẩu" });
//    }
//});

router.post("/register", (req, res) => {
    const { name, email, password, age, weight, height, gender } = req.body;
    if (!name || !email || !password || !age || !weight || !height || !gender) {
        return res.status(400).json({ error: "Vui lòng nhập đầy đủ tất cả thông tin." });
    }

    // Kiểm tra email đã tồn tại
    db.query('SELECT id FROM user WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error("❌ Lỗi khi kiểm tra email:", err.message);
            return res.status(500).json({ error: "Lỗi khi kiểm tra email!" });
        }
        if (results.length > 0) {
            return res.status(400).json({ error: "Email đã tồn tại!" });
        }

        // Hash password và insert user mới
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error("❌ Hash error:", err.message);
                return res.status(500).json({ error: "Lỗi khi mã hóa mật khẩu" });
            }
            const defaultAvatar = "/avatars/default.png";
            const sql = `
                INSERT INTO user (name, email, password, age, weight, height, gender, avatarUrl)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.query(sql, [name, email, hash, age, weight, height, gender, defaultAvatar], (err, result) => {
                if (err) {
                    console.error("❌ Lỗi khi thêm người dùng:", err.message);
                    return res.status(500).json({ error: "Đăng ký thất bại.", details: err.message });
                }
                res.status(201).json({
                    message: "Đăng ký thành công!",
                    userId: result.insertId
                });
            });
        });
    });
});

// 🔐 Đăng nhập
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Thiếu email hoặc mật khẩu" });
    }

    db.query("SELECT * FROM user WHERE email = ?", [email], (err, rows) => {
        if (err) {
            console.error("❌ Lỗi truy vấn:", err.message);
            return res.status(500).json({ message: "Lỗi server" });
        }
        if (!rows.length) {
            return res.status(401).json({ message: "Email không tồn tại" });
        }
        const user = rows[0];
        bcrypt.compare(password, user.password, (err, match) => {
            if (err) {
                console.error("❌ Lỗi khi so sánh mật khẩu:", err.message);
                return res.status(500).json({ message: "Lỗi khi xác thực người dùng" });
            }
            if (!match) {
                return res.status(401).json({ message: "Sai mật khẩu" });
            }
            const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "2h" });
            res.json({ token });
        });
    });
});

// 👤 Lấy thông tin profile
router.get("/profile", verifyToken, (req, res) => {
    const userId = req.user.id;
    const sql = `
        SELECT id, name, email, age, weight, height, gender, goal, activity_level, avatarUrl
        FROM user
        WHERE id = ?
    `;
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!results.length) return res.status(404).json({ message: "User not found" });
        res.json(results[0]);
    });
});

// ✏️ Cập nhật profile
router.put("/profile", verifyToken, (req, res) => {
    const userId = req.user.id;
    const { name, email, age, gender, goal, activity_level, weight, height } = req.body;

    const sql = `
        UPDATE user
        SET name = ?, email = ?, age = ?, gender = ?, goal = ?, activity_level = ?, weight = ?, height = ?
        WHERE id = ?
    `;

    db.query(sql, [name, email, age, gender, goal, activity_level, weight, height, userId], (err, result) => {
        if (err) {
            console.error("❌ Lỗi khi cập nhật profile:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Profile updated successfully" });
    });
});

// 🔑 Đổi mật khẩu
router.put("/profile/password", verifyToken, (req, res) => {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Both old and new passwords are required" });
    }

    db.query("SELECT password FROM user WHERE id = ?", [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!results.length) return res.status(404).json({ message: "User not found" });

        const currentHash = results[0].password;
        if (!currentHash || typeof currentHash !== 'string') {
            return res.status(500).json({ message: "Invalid password hash from DB" });
        }
        bcrypt.compare(oldPassword, currentHash, (err, match) => {
            if (err) {
                console.error("Compare error:", err.message);
                return res.status(500).json({ message: "Error comparing passwords" });
            }
            if (!match) {
                return res.status(403).json({ message: "Old password is incorrect" });
            }
            bcrypt.hash(newPassword, 10, (err, newHash) => {
                if (err) return res.status(500).json({ message: "Error hashing new password" });
                db.query("UPDATE user SET password = ? WHERE id = ?", [newHash, userId], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    return res.json({ message: "Password changed successfully" });
                });
            });
        });
    });
});

// ❌ Xoá tài khoản
router.delete('/profile', verifyToken, (req, res) => {
    const userId = req.user.id;
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

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../public/avatars')),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `avatar_${req.user.id}${ext}`);
    }
});

const upload = multer({ storage });

// POST /api/profile/avatar
router.post(
    '/profile/avatar',
    verifyToken,
    upload.single('avatar'),
    (req, res) => {
        if (!req.file) return res.status(400).json({ message: 'Chưa chọn file' });
        const avatarUrl = `/avatars/${req.file.filename}`;

        db.query(
            'UPDATE user SET avatarUrl = ? WHERE id = ?',
            [avatarUrl, req.user.id],
            err => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ avatarUrl });
            }
        );
    }
);

const addNotification = (userId, message) => {
    const sql = 'INSERT INTO notifications (user_id, message) VALUES (?, ?)';
    db.query(sql, [userId, message], (err) => {
        if (err) {
            console.error("Không thể thêm thông báo", err.message);
        }
    });
};

// POST /api/nutrition-goal
router.post('/nutrition-goal', verifyToken, async (req, res) => {
    const { calories, protein, fat, carbs } = req.body;
    const userId = req.user.id;

    // Logic thêm vào bảng ke_hoach_dinh_duong
    await db.promise().query(`
        INSERT INTO ke_hoach_dinh_duong (user_id, calo_goal, protein_goal, fat_goal, carb_goal)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        calo_goal = VALUES(calo_goal),
        protein_goal = VALUES(protein_goal),
        fat_goal = VALUES(fat_goal),
        carb_goal = VALUES(carb_goal)
    `, [userId, calories, protein, fat, carbs]);

    // Thêm thông báo
    addNotification(userId, "Your nutrition goals have been updated.");
    const upload = multer({ storage });

    router.post('/profile/avatar', verifyToken, upload.single('avatar'), (req, res) => {
        if (!req.file) return res.status(400).json({ message: 'Chưa chọn file' });
        const avatarUrl = `/avatars/${req.file.filename}`;

        res.json({ message: 'Your nutrition goals have been saved.' });
    });
});

module.exports = router;