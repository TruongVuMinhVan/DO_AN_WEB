import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpInfoPage = () => {
    const [info, setInfo] = useState({
        age: '',
        weight: '',
        height: '',
        gender: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 👉 Lấy dữ liệu từ localStorage
        const basicInfo = JSON.parse(localStorage.getItem("signup_basic"));

        if (!basicInfo) {
            alert("Thiếu thông tin cơ bản. Vui lòng đăng ký lại.");
            navigate("/signup");
            return;
        }

        const fullUserData = {
            ...basicInfo,
            ...info,
        };

        try {
            const res = await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(fullUserData)
            });

            if (!res.ok) throw new Error("Đăng ký thất bại!");

            alert("🎉 Đăng ký thành công!");
            localStorage.removeItem("signup_basic");
            navigate("/home");
        } catch (err) {
            alert("❌ " + err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-50">
            <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-lg">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Thông Tin Cá Nhân</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="number"
                        name="age"
                        value={info.age}
                        onChange={handleChange}
                        placeholder="Tuổi"
                        className="w-full px-4 py-2 rounded bg-gray-100"
                        required
                    />
                    <input
                        type="number"
                        name="weight"
                        value={info.weight}
                        onChange={handleChange}
                        placeholder="Cân nặng (kg)"
                        className="w-full px-4 py-2 rounded bg-gray-100"
                        required
                    />
                    <input
                        type="number"
                        name="height"
                        value={info.height}
                        onChange={handleChange}
                        placeholder="Chiều cao (cm)"
                        className="w-full px-4 py-2 rounded bg-gray-100"
                        required
                    />
                    <select
                        name="gender"
                        value={info.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded bg-gray-100"
                        required
                    >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                    </select>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-full hover:bg-blue-700"
                    >
                        Tiếp tục
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUpInfoPage;
