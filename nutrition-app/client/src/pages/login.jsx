import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                navigate('/home');
            } else {
                setError(data.message || 'Đăng nhập thất bại');
            }
        } catch {
            setError('Lỗi kết nối server');
        }
    };

    return (
        <div className="nen-dang-nhap min-h-screen flex items-center justify-center">
            <div className="dangnhap-khung-chinh w-4/5 max-w-5xl flex overflow-hidden bg-white rounded-2xl shadow-2xl">
                {/* Bên trái: Form Đăng Nhập */}
                <div className="dangnhap-form-benh w-3/4 p-12 flex flex-col justify-center">
                    <h1 className="dangnhap-tieu-de text-4xl font-bold text-center mb-4">
                        ĐĂNG NHẬP TÀI KHOẢN
                    </h1>
                    <p className="dangnhap-mo-ta text-center mb-6 text-gray-500">
                        Đăng nhập qua mạng xã hội
                    </p>

                    {/* Nút MXH */}
                    <div className="dangnhap-mxh-khung flex gap-4 mb-6 justify-center">
                        <button className="mxh-facebook bg-[#3b5998] text-white rounded-full w-10 h-10">f</button>
                        <button className="mxh-google bg-[#db4437] text-white rounded-full w-10 h-10">G+</button>
                        <button className="mxh-linkedin bg-[#0077b5] text-white rounded-full w-10 h-10">in</button>
                    </div>

                    {/* HOẶC */}
                    <div className="dangnhap-hoac-khung flex items-center my-6">
                        <div className="dangnhap-hoac-duong-ke flex-grow h-px bg-gray-300"></div>
                        <span className="dangnhap-hoac-chu px-4 text-gray-400">HOẶC</span>
                        <div className="dangnhap-hoac-duong-ke flex-grow h-px bg-gray-300"></div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="dangnhap-form space-y-4 mx-auto max-w-md">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="dangnhap-input w-full px-3 py-2 rounded bg-gray-100"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Mật khẩu"
                            className="dangnhap-input w-full px-3 py-2 rounded bg-gray-100"
                            required
                        />
                        {error && <p className="dangnhap-loi text-red-500">{error}</p>}
                        <button
                            type="submit"
                            className="dangnhap-nut mx-auto block bg-gray-700 text-white px-12 py-2 rounded-full mt-4"
                        >
                            Đăng Nhập
                        </button>
                    </form>
                </div>

                {/* Bên phải: Chưa có tài khoản */}
                <div className="dangnhap-chuakco w-1/4 bg-gradient-to-br from-blue-400 to-green-500 text-white p-10 flex flex-col justify-center items-center">
                    <h2 className="chuakco-tieu-de text-2xl font-bold mb-4">
                        CHƯA CÓ TÀI KHOẢN?
                    </h2>
                    <p className="chuakco-mo-ta mb-6 text-center">
                        Đăng ký để khám phá thêm
                    </p>
                    <button
                        onClick={() => navigate('/signUpPage')}
                        className="chuakco-nut-dangky bg-white text-teal-600 px-6 py-2 rounded-full font-medium"
                    >
                        Đăng Ký
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
