const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../middleware/auth");  // Middleware xác thực

// POST /api/history — lưu lịch sử tìm kiếm
router.post("/history", verifyToken, (req, res) => {
    const userId = req.user.id;
    const { query } = req.body;

    // Tìm xem đã có dòng nào cùng query cho user chưa
    const checkSql = `SELECT id FROM lich_su_tim_kiem WHERE user_id = ? AND query = ? LIMIT 1`;

    db.query(checkSql, [userId, query], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        if (rows.length > 0) {
            // Nếu đã tồn tại: cập nhật lại created_at
            const updateSql = `UPDATE lich_su_tim_kiem SET created_at = NOW() WHERE id = ?`;
            db.query(updateSql, [rows[0].id], (err2) => {
                if (err2) return res.status(500).json({ error: err2.message });
                return res.status(200).json({ message: "Đã cập nhật thời gian lịch sử" });
            });
        } else {
            // Nếu chưa có: thêm mới
            const insertSql = `INSERT INTO lich_su_tim_kiem (user_id, query) VALUES (?, ?)`;
            db.query(insertSql, [userId, query], (err3) => {
                if (err3) return res.status(500).json({ error: err3.message });
                return res.status(201).json({ message: "Lưu lịch sử thành công" });
            });
        }
    });
});

// GET /api/history — lấy lịch sử tìm kiếm
router.get("/history", verifyToken, (req, res) => {
    const sql = `SELECT * FROM lich_su_tim_kiem WHERE user_id = ? ORDER BY created_at DESC`;
    db.query(sql, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

router.delete("/history/:id", verifyToken, (req, res) => {
    const histId = req.params.id;
    const sql = "DELETE FROM lich_su_tim_kiem WHERE id = ?";
    db.query(sql, [histId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Không tìm thấy lịch sử để xóa" });
        }
        res.json({ message: "Xóa lịch sử thành công" });
    });
});

module.exports = router;
