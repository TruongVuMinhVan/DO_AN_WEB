const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',  // Kiểm tra đúng tên host
  user: 'root',       // Đảm bảo đúng username
  password: '',       // Kiểm tra password
  database: 'nutrition_db'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Kết nối MySQL thất bại:', err);
  } else {
    console.log('✅ Đã kết nối MySQL thành công');
  }
});

module.exports = db;
