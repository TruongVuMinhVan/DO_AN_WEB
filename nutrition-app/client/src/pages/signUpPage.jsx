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
        <div className="nen-dang-ky min-h-screen flex items-center justify-center">
            <div className="dangky-khung-chinh w-4/5 max-w-5xl flex overflow-hidden">
                {/* Bên trái: Form đăng ký */}
                <div className="dangky-form-benh w-3/4 p-12 flex flex-col justify-center">
                    <h2 className="dangky-tieu-de text-4xl font-bold text-center text-blue-700 mb-4">
                        TẠO TÀI KHOẢN
                    </h2>
                    <p className="dangky-mo-ta text-center text-gray-500 mb-6">
                        Đăng ký và bắt đầu hành trình của bạn.
                    </p>

                    {/* Nút MXH */}
                    <div className="dangky-mxh-khung flex gap-4 mb-6 justify-center">
                        <button className="dangky-mxh-facebook bg-[#3b5998] text-white rounded-full w-10 h-10">
                            f
                        </button>
                        <button className="dangky-mxh-google bg-[#db4437] text-white rounded-full w-10 h-10">
                            G+
                        </button>
                        <button className="dangky-mxh-linkedin bg-[#0077b5] text-white rounded-full w-10 h-10">
                            in
                        </button>
                    </div>

                    {/* HOẶC */}
                    <div className="dangky-hoac-khung flex items-center my-6">
                        <div className="dangky-hoac-duong-ke flex-grow h-px bg-gray-300"></div>
                        <span className="dangky-hoac-chu px-4 text-gray-400">HOẶC</span>
                        <div className="dangky-hoac-duong-ke flex-grow h-px bg-gray-300"></div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleNext} className="dangky-form space-y-4 mx-auto max-w-md">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Họ và tên"
                            className="dangky-input w-full px-3 py-2 rounded bg-gray-100"
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="dangky-input w-full px-3 py-2 rounded bg-gray-100"
                        />
                        {error && <p className="dangky-loi text-red-500 text-sm mt-1">{error}</p>}
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Mật khẩu"
                            className="dangky-input w-full px-3 py-2 rounded bg-gray-100"
                        />

                        <button
                            type="submit"
                            className="dangky-nut-tieptuc mx-auto block bg-gray-700 text-white px-12 py-2 rounded-full mt-4"
                        >
                            Tiếp Theo
                        </button>
                    </form>
                </div>

                {/* Bên phải: Đã có tài khoản */}
                <div className="dangky-da-co-tai-khoan w-1/4 bg-gradient-to-br from-blue-400 to-green-500 text-white p-10 flex flex-col justify-center items-center">
                    <h2 className="dangky-da-co-tieu-de text-2xl font-bold mb-4 text-center">
                        ĐÃ CÓ TÀI KHOẢN?
                    </h2>
                    <p className="dangky-da-co-mo-ta mb-6">
                        Đăng nhập để khám phá website
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="dangky-nut-dangnhap bg-white text-teal-600 px-6 py-2 rounded-full font-medium"
                    >
                        Đăng Nhập
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
