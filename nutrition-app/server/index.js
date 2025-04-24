const express = require("express");
const cors = require("cors");
const db = require("./db");
const userRoutes = require("./routes/user"); // ✅ Import các route

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ✅ Route test DB
app.get("/test-db", (req, res) => {
    db.query("SELECT 1 + 1 AS result", (err, result) => {
        if (err) {
            console.error("❌ Lỗi kết nối MySQL:", err.message);
            return res.status(500).json({ status: "fail", error: err.message });
        }
        res.json({ status: "success", result: result[0].result });
    });
});

// ✅ Route đăng ký ngay trong index.js (tạm thời nếu muốn)
app.post("/register", (req, res) => {
    const { name, email, password, age, weight, height, gender } = req.body;

    const query = `
        INSERT INTO user (name, email, password, age, weight, height, gender)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [name, email, password, age, weight, height, gender], (err, result) => {
        if (err) {
            console.error("❌ Lỗi khi đăng ký:", err.message);
            return res.status(500).json({ error: "Đăng ký thất bại!" });
        }

        res.status(201).json({ message: "Đăng ký thành công!" });
    });
});

// ✅ Dùng route login trong routes/user.js
app.use("/api", userRoutes);

// ✅ Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
