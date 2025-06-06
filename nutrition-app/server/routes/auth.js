const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db');

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query(
    'SELECT * FROM user WHERE email = ?',
    [email],
    (err, users) => {
      if (err) {
        console.error('Lỗi đăng nhập:', err);
        return res.status(500).json({ message: 'Lỗi máy chủ khi đăng nhập.' });
      }

      if (!users.length) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
      }

      const user = users[0];

      // So sánh mật khẩu đã hash
      bcrypt.compare(password, user.password, (err, match) => {
        if (err) {
          console.error('Lỗi khi so sánh mật khẩu:', err);
          return res.status(500).json({ message: 'Lỗi xác thực.' });
        }
        if (!match) {
          return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng.' });
        }
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email
          },
          process.env.JWT_SECRET,
          { expiresIn: '2h' }
        );

        res.json({ token });
      });
    }
  );
});
module.exports = router;