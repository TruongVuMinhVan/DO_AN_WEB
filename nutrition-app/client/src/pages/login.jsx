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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/api/login", { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });


            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.token); 
                alert("Đăng nhập thành công!");
                navigate("/home");
            } else {
                setError(data.message || 'Đăng nhập thất bại');
            }
        } catch (err) {
            setError('Lỗi kết nối server');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center home-bg">
            <div className="w-4/5 max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex">
                <div className="w-3/4 p-12 flex flex-col justify-center">
                    <h1 className="text-4xl font-bold text-center mb-4">Login to Your Account</h1>
                    <p className="text-center mb-6 text-gray-500">Login using social networks</p>

                    <div className="flex gap-4 mb-6 justify-center">
                        <button className="bg-[#3b5998] text-white rounded-full w-10 h-10">f</button>
                        <button className="bg-[#db4437] text-white rounded-full w-10 h-10">G+</button>
                        <button className="bg-[#0077b5] text-white rounded-full w-10 h-10">in</button>
                    </div>

                    <div className="flex items-center my-6">
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <span className="px-4 text-gray-400">OR</span>
                        <div className="flex-grow h-px bg-gray-300"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 mx-auto max-w-md">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full px-3 py-2 rounded bg-gray-100"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full px-3 py-2 rounded bg-gray-100"
                            required
                        />
                        {error && <p className="text-red-500">{error}</p>}
                        <button type="submit" className="mx-auto block bg-gray-700 text-white px-12 py-2 rounded-full mt-4">
                            Sign In
                        </button>
                    </form>
                </div>

                <div className="w-1/4 bg-gradient-to-br from-blue-400 to-green-500 text-white p-10 flex flex-col justify-center items-center">
                    <h2 className="text-2xl font-bold mb-4">Chưa Có Tài Khoản?</h2>
                    <p className="mb-6 text-center">Đăng ký và khám phá nhiều cơ hội mới!</p>
                    <button
                        onClick={() => navigate('/signUpPage')}
                        className="bg-white text-teal-600 px-6 py-2 rounded-full font-medium"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
