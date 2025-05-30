require('dotenv').config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const path = require('path');
const app = express();
const PORT = 5000;
// ✅ Import các route
const userRoutes = require("./routes/user");
const historyRoutes = require('./routes/history');
const mealRoutes = require('./routes/meal');
app.use(cors());
app.use(express.json());

// Serve thư mục avatars tĩnh để client có thể lấy ảnh qua URL /avatars/…
app.use(
    '/avatars',
    express.static(path.join(__dirname, 'public/avatars'))
);

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

// ✅ Dùng routes/user.js
app.use('/api', userRoutes);

// ✅ Dùng server/history.js
app.use("/api", historyRoutes);

// ✅ Dùng server/meal.js
app.use('/api', mealRoutes);

// ✅ Dùng server/food.js
app.use('/api/foods', require('./routes/food'));

// ✅ Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
