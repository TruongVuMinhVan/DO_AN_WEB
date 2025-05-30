// POST /login
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: "fail", message: "Thiếu email hoặc password." });
    }

    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error("❌ Lỗi truy vấn:", err);
            return res.status(500).json({ status: "error", message: "Lỗi server." });
        }

        if (results.length === 0) {
            return res.status(401).json({ status: "fail", message: "Email không tồn tại." });
        }

        const user = results[0];

        // 👉 Nếu có dùng bcrypt thì check bcrypt.compareSync(password, user.password)
        if (user.password !== password) {
            return res.status(401).json({ status: "fail", message: "Sai mật khẩu." });
        }

        // 🟢 Đăng nhập thành công
        res.json({ status: "success", message: "Đăng nhập thành công!", user });
    });
});
