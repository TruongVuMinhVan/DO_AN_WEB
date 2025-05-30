const jwt = require("jsonwebtoken");
const SECRET_KEY = "your_secret_key";
function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

    if (!token) return res.status(401).json({ message: "Không có token." });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Token không hợp lệ." });

        req.user = user; // Gắn user vào req để sử dụng tiếp
        next();
    });
}

module.exports = verifyToken;