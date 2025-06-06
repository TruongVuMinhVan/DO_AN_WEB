require('dotenv').config();
const express = require("express");
const cors = require("cors");
const db = require("./db");
const path = require('path');
const app = express();
const PORT = 5000;
const verifyToken = require('./middleware/auth');

const userRoutes = require("./routes/user");
const historyRoutes = require('./routes/history');
const mealRoutes = require('./routes/meal');
const physicalInfoRoutes = require('./routes/physicalInfo');
const explainAlternativeRoute = require('./routes/explainAlternative');
const aiSuggestionRouter = require('./routes/AI-suggestion');
const authRoutes = require('./routes/auth');
app.use(cors());
app.use(express.json());

app.use(
    '/avatars',
    express.static(path.join(__dirname, 'public/avatars'))
);

app.get("/test-db", (req, res) => {
    db.query("SELECT 1 + 1 AS result", (err, result) => {
        if (err) {
            console.error("❌ Lỗi kết nối MySQL:", err.message);
            return res.status(500).json({ status: "fail", error: err.message });
        }
        res.json({ status: "success", result: result[0].result });
    });
});
app.use('/api', authRoutes);
app.use('/api/foods/explain-alternative', explainAlternativeRoute);
app.use('/api', userRoutes);
app.use('/api/foods/ai-suggestions', verifyToken, aiSuggestionRouter);
app.use("/api", historyRoutes);
app.use('/api', mealRoutes);
app.use('/api/foods', require('./routes/food'));
app.use('/api/physicalInfo', physicalInfoRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});