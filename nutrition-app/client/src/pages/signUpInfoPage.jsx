import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/signUpInfoPage.css";

const SignUpInfoPage = () => {
    const [info, setInfo] = useState({
        age: '',
        weight: '',
        height: '',
        gender: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        const basic = localStorage.getItem("signup_basic");
        if (!basic) {
            alert("Thiếu thông tin cơ bản, vui lòng đăng ký lại.");
            navigate("/signUpPage");
        }
    }, [navigate]);

    const handleChange = e => {
        setInfo({ ...info, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        const basic = JSON.parse(localStorage.getItem("signup_basic") || "{}");
        if (!basic.email || !basic.password) {
            alert("Thiếu thông tin cơ bản, vui lòng đăng ký lại.");
            return navigate("/signUpPage");
        }

        const payload = { ...basic, ...info };

        try {
            // Đăng ký
            let res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!res.ok) {
                const { error } = await res.json();
                throw new Error(error || "Đăng ký thất bại.");
            }

            // Tự động đăng nhập
            res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: basic.email,
                    password: basic.password
                })
            });
            const loginData = await res.json();
            if (!res.ok) throw new Error(loginData.message || "Đăng nhập thất bại.");

            // Lưu token & chuyển hướng
            localStorage.setItem("token", loginData.token);
            localStorage.removeItem("signup_basic");
            alert("🎉 Đăng ký và đăng nhập thành công!");
            navigate("/login");
        } catch (err) {
            alert("❌ " + err.message);
        }
    };

    return (
        <div className="info-nensignup">
            <div className="info-form-khung">
                <h2 className="info-tieude">Thông Tin Cá Nhân</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="number"
                        name="age"
                        value={info.age}
                        onChange={handleChange}
                        placeholder="Tuổi"
                        required
                        className="info-input"
                    />
                    <input
                        type="number"
                        name="weight"
                        value={info.weight}
                        onChange={handleChange}
                        placeholder="Cân nặng (kg)"
                        required
                        className="info-input"
                    />
                    <input
                        type="number"
                        name="height"
                        value={info.height}
                        onChange={handleChange}
                        placeholder="Chiều cao (cm)"
                        required
                        className="info-input"
                    />
                    <select
                        name="gender"
                        value={info.gender}
                        onChange={handleChange}
                        required
                        className="info-select"
                    >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                    </select>
                    <button
                        type="submit"
                        className="info-submit-btn"
                    >
                        Tiếp tục
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUpInfoPage;
