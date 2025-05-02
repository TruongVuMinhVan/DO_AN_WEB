const express = require("express");
const cors = require("cors");
const db = require("./db");
// ✅ Import các route
const userRoutes = require("./routes/user"); 
const historyRoutes = require('./routes/history');

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

// ✅ Dùng routes/user.js
app.use('/api', userRoutes);

// ✅ Dùng server/index.js
app.use("/api", historyRoutes);

// ✅ Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
