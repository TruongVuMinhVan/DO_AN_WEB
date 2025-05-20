// server/db.js
require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nutrition_db',
    waitForConnections: true,
    connectionLimit: 10,
});

// Test kết nối một lần khi khởi động
db.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Kết nối MySQL thất bại:', err.message);
    } else {
        console.log('✅ Đã kết nối MySQL thành công!');
        connection.release();
    }
});

module.exports = db;
