const express = require("express");
const cors = require("cors");
const app = express();
<<<<<<< Updated upstream
=======
const PORT = 5000;
// ✅ Import các route
const userRoutes = require("./routes/user");
const historyRoutes = require('./routes/history');
const mealRoutes = require('./routes/meal');
>>>>>>> Stashed changes

app.use(cors());
app.use(express.json());

<<<<<<< Updated upstream
<<<<<<< Updated upstream
app.get("/", (req, res) => {
  res.send("Backend is running");
=======
=======
>>>>>>> Stashed changes
// Serve thư mục avatars tĩnh để client có thể lấy ảnh qua URL /avatars/…
const path = require('path');
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
>>>>>>> Stashed changes
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
