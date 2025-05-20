const express = require("express");
const cors = require("cors");
const db = require("./db");
const app = express();
<<<<<<< HEAD
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

=======
const PORT = 5000;
// ✅ Import các route
const userRoutes = require("./routes/user"); 
const historyRoutes = require('./routes/history');
const mealRoutes = require('./routes/meal');
app.use(cors());
app.use(express.json());

>>>>>>> f217226a2968b9de084227ab6b12b5c643e17947
// ✅ Route test DB
app.get("/test-db", (req, res) => {
    db.query("SELECT 1 + 1 AS result", (err, result) => {
        if (err) {
            console.error("❌ Lỗi kết nối MySQL:", err.message);
            return res.status(500).json({ status: "fail", error: err.message });
        }
        res.json({ status: "success", result: result[0].result });
    });
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> f217226a2968b9de084227ab6b12b5c643e17947
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
