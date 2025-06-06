// server/routes/notifications.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../middleware/auth");

// 1) Lấy danh sách notifications
router.get("/notifications", verifyToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const [rows] = await db.promise().query(
            "SELECT id, message, detail, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
            [userId]
        );
        res.json(rows);
    } catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ message: "Error fetching notifications" });
    }
});

// 2) Đánh dấu tất cả notifications là đã đọc
router.put("/notifications/read-all", verifyToken, async (req, res) => {
    const userId = req.user.id;
    try {
        await db.promise().query(
            "UPDATE notifications SET is_read = 1 WHERE user_id = ?",
            [userId]
        );
        res.json({ message: "All notifications marked as read" });
    } catch (err) {
        console.error("Error marking all as read:", err);
        res.status(500).json({ message: "Error marking notifications as read" });
    }
});

// 3) Đánh dấu một notification (id) là đã đọc và trả về detail
router.put("/notifications/:id/read", verifyToken, async (req, res) => {
    const userId = req.user.id;
    const notifId = req.params.id;
    try {
        // Cập nhật is_read = 1 nếu notification thuộc về user
        const [updateResult] = await db.promise().query(
            "UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?",
            [notifId, userId]
        );

        // Nếu không có row nào bị ảnh hưởng, nghĩa là id không tồn tại hoặc không của user đó
        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: "Notification not found" });
        }

        // Lấy detail của notification vừa cập nhật
        const [[row]] = await db.promise().query(
            "SELECT detail FROM notifications WHERE id = ? AND user_id = ?",
            [notifId, userId]
        );
        // row.detail có thể null nếu không có detail
        res.json({ detail: row ? row.detail : null });
    } catch (err) {
        console.error("Error marking single notification as read:", err);
        res.status(500).json({ message: "Error marking notification as read" });
    }
});

// 4) Xóa một notification
router.delete("/notifications/:id", verifyToken, async (req, res) => {
    const userId = req.user.id;
    const notifId = req.params.id;
    try {
        const [deleteResult] = await db.promise().query(
            "DELETE FROM notifications WHERE id = ? AND user_id = ?",
            [notifId, userId]
        );
        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({ message: "Notification not found" });
        }
        res.json({ message: "Notification deleted" });
    } catch (err) {
        console.error("Error deleting notification:", err);
        res.status(500).json({ message: "Error deleting notification" });
    }
});

// 5) Tạo mới một notification (gửi thông báo)
router.post("/notifications", verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { message, detail } = req.body;

    // Bắt buộc có message (nội dung ngắn)
    if (!message) {
        return res.status(400).json({ message: "Missing notification message" });
    }

    try {
        await db.promise().query(
            `INSERT INTO notifications (user_id, message, detail, is_read) VALUES (?, ?, ?, 0)`,
            [userId, message, detail || null]
        );
        res.json({ message: "Notification sent successfully" });
    } catch (err) {
        console.error("Error sending notification:", err);
        res.status(500).json({ message: "Error sending notification" });
    }
});

module.exports = router;
