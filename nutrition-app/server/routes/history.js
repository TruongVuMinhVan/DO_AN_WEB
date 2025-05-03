const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../middleware/auth");  // Middleware xác thực

// POST /api/history — lưu lịch sử tìm kiếm
router.post("/history", verifyToken, (req, res) => {
    const userId = req.user.id;
    const { query } = req.body;

    const sql = `INSERT INTO lich_su_tim_kiem (user_id, query) VALUES (?, ?)`;
    db.query(sql, [userId, query], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Lưu lịch sử thành công" });
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
