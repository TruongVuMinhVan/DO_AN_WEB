import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSignUpForm from '../hooks/useSignUpForm';
import '../styles/signUpPage.css';

const SignUpPage = () => {
    const { formData, error, handleChange } = useSignUpForm();
    const navigate = useNavigate();

    const handleNext = (e) => {
        e.preventDefault();

        // Kiểm tra đơn giản
        if (!formData.name || !formData.email || !formData.password) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        // Lưu tạm thông tin vào localStorage
        localStorage.setItem('signup_basic', JSON.stringify(formData));

        // Điều hướng sang trang nhập thông tin cá nhân
        navigate('/signup-info');
    };

    return (
        <div className="min-h-screen flex items-center justify-center signup-background">
            <div className="w-4/5 max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex">
                {/* Left: Sign Up Form */}
                <div className="w-3/4 p-12 flex flex-col justify-center">
                    <h2 className="text-4xl font-bold text-center text-blue-700 mb-4">Create Account</h2>
                    <p className="text-center text-gray-500 mb-6">Đăng ký tài khoản để bắt đầu hành trình của bạn.</p>

                    {/* Social Buttons */}
                    <div className="flex gap-4 mb-6 justify-center">
                        <button className="bg-[#3b5998] text-white rounded-full w-10 h-10">f</button>
                        <button className="bg-[#db4437] text-white rounded-full w-10 h-10">G+</button>
                        <button className="bg-[#0077b5] text-white rounded-full w-10 h-10">in</button>
                    </div>

                    {/* OR */}
                    <div className="flex items-center my-6">
                        <div className="flex-grow h-px bg-gray-300"></div>
                        <span className="px-4 text-gray-400">OR</span>
                        <div className="flex-grow h-px bg-gray-300"></div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleNext} className="space-y-4 mx-auto max-w-md">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="w-full px-3 py-2 rounded bg-gray-100"
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full px-3 py-2 rounded bg-gray-100"
                        />
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full px-3 py-2 rounded bg-gray-100"
                        />

                        <button
                            type="submit"
                            className="mx-auto block bg-gray-700 text-white px-12 py-2 rounded-full mt-4"
                        >
                            Next
                        </button>
                    </form>
                </div>

                {/* Right: Already Have Account */}
                <div className="w-1/4 bg-gradient-to-br from-blue-400 to-green-500 text-white p-10 flex flex-col justify-center items-center">
                    <h2 className="text-2xl font-bold mb-4">Đã Có Tài Khoản?</h2>
                    <p className="mb-6 text-center">Đăng nhập để tiếp tục khám phá!</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-white text-teal-600 px-6 py-2 rounded-full font-medium"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
