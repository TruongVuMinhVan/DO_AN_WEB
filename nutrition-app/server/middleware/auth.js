const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET;  

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];


  if (!authHeader) {
    console.error("Không có token trong header của yêu cầu.");
    return res.status(401).json({ message: "Không có token trong header." });
  }
  const token = authHeader.split(" ")[1]; // "Bearer TOKEN"
  if (!token) {
    console.error("Token không hợp lệ.");
    return res.status(401).json({ message: "Token không hợp lệ." });
  }

  // Kiểm tra và xác thực token
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error(`Token không hợp lệ: ${err.message}. Token đã hết hạn hoặc không hợp lệ.`);
      return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
    }

    // Gán thông tin người dùng vào req.user
    req.user = user;

    next();
  });
}

module.exports = verifyToken;
