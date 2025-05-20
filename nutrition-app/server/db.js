const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // XAMPP mặc định là rỗng
    database: "nutrition_db", // thay bằng tên CSDL của bạn
});

connection.connect((err) => {
    if (err) {
        console.error("❌ Kết nối thất bại:", err.message);
    } else {
        console.log("✅ Đã kết nối MySQL thành công!");
    }
});

module.exports = connection;
