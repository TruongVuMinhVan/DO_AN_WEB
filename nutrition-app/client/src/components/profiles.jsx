import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        age: '',
        gender: '',
        goal: '',
        allergies: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const res = await axios.get('http://localhost:5000/api/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Map gender từ English → Tiếng Việt
                const genderVi = res.data.gender === 'male' ? 'Nam' :
                    res.data.gender === 'female' ? 'Nữ' :
                        res.data.gender === 'other' ? 'Khác' : '';

                setUser({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    age: res.data.age || '',
                    gender: genderVi,
                    goal: res.data.goal || '',
                    allergies: res.data.allergies || ''
                });
            } catch (err) {
                console.error("❌ Không lấy được user:", err);
                setError('Không thể tải hồ sơ người dùng.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        // Map gender từ Tiếng Việt → English
        let genderMapped = '';
        if (user.gender === 'Nam') genderMapped = 'male';
        else if (user.gender === 'Nữ') genderMapped = 'female';
        else if (user.gender === 'Khác') genderMapped = 'other';
        else genderMapped = '';

        try {
            await axios.put('http://localhost:5000/api/profile',
                { ...user, gender: genderMapped },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("🎉 Lưu thành công!");
        } catch (error) {
            console.error("❌ Lỗi khi lưu:", error);
            alert("Lưu thất bại!");
        }
    };

    if (loading) return <p className="text-center mt-6">⏳ Đang tải dữ liệu...</p>;
    if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md w-full max-w-2xl mx-auto mt-10">
            <h2 className="text-2xl font-bold text-teal-600 mb-4">Cập nhật hồ sơ</h2>

            <input
                type="text"
                name="name"
                placeholder="Họ tên"
                value={user.name}
                onChange={handleChange}
                className="block w-full mb-3 p-2 border rounded"
            />

            <input
                type="email"
                name="email"
                placeholder="Email"
                value={user.email}
                onChange={handleChange}
                className="block w-full mb-3 p-2 border rounded"
            />

            <input
                type="number"
                name="age"
                placeholder="Tuổi"
                value={user.age}
                onChange={handleChange}
                className="block w-full mb-3 p-2 border rounded"
            />

            <select
                name="gender"
                value={user.gender}
                onChange={handleChange}
                className="block w-full mb-3 p-2 border rounded"
            >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
            </select>

            <input
                type="text"
                name="goal"
                placeholder="Mục tiêu sức khoẻ"
                value={user.goal}
                onChange={handleChange}
                className="block w-full mb-3 p-2 border rounded"
            />

            <input
                type="text"
                name="allergies"
                placeholder="Dị ứng"
                value={user.allergies}
                onChange={handleChange}
                className="block w-full mb-3 p-2 border rounded"
            />

            <div className="flex gap-4 mt-4">
                <button
                    type="submit"
                    className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
                >
                    💾 Lưu thông tin
                </button>

                <button
                    type="button"
                    onClick={async () => {
                        const confirmDelete = window.confirm("⚠️ Bạn có chắc chắn muốn xóa tài khoản không? Hành động này không thể hoàn tác.");
                        if (confirmDelete) {
                            try {
                                const token = localStorage.getItem('token');
                                await axios.delete('http://localhost:5000/api/profile', {
                                    headers: { Authorization: `Bearer ${token}` }
                                });
                                alert("✅ Tài khoản đã được xóa!");
                                localStorage.removeItem('token');
                                navigate('/login');
                            } catch (error) {
                                console.error("❌ Xoá thất bại:", error.response?.data || error.message);
                                alert("Có lỗi xảy ra khi xóa tài khoản: " + (error.response?.data?.message || error.message));
                            }
                        }
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    🗑️ Xóa tài khoản
                </button>
            </div>
        </form>
    );
};

export default Profile;
