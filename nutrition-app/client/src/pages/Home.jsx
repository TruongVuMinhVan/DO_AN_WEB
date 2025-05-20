import React from 'react';
import { Link } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area
} from 'recharts';

const features = [
    {
        title: 'Tìm kiếm món ăn',
        desc: 'Tra cứu thông tin dinh dưỡng của các món ăn.',
        img: 'https://cdn-icons-png.flaticon.com/512/1046/1046784.png',
        link: '/food',
        color: 'from-green-200 to-green-100'
    },
    {
        title: 'Dashboard',
        desc: 'Xem tổng quan chế độ ăn uống và sức khỏe của bạn.',
        img: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        link: '/dashboard',
        color: 'from-blue-200 to-blue-100'
    },
    {
        title: 'Profile',
        desc: 'Quản lý thông tin cá nhân và mục tiêu sức khỏe.',
        img: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png',
        link: '/profile',
        color: 'from-yellow-200 to-yellow-100'
    },
    {
        title: 'Cài đặt',
        desc: 'Tùy chỉnh ứng dụng theo ý bạn.',
        img: 'https://cdn-icons-png.flaticon.com/512/2099/2099058.png',
        link: '/settings',
        color: 'from-purple-200 to-purple-100'
    }
];

// Dữ liệu mẫu cho biểu đồ cân nặng
const weightData = [
    { date: '21. Apr', weight: 47 },
    { date: '28. Apr', weight: 47 },
    { date: '5. May', weight: 47 },
    { date: '12. May', weight: 47 }
];

const Home = () => {
    return (
        <div className="min-h-screen bg-[#fdfaf4] py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2 text-center">
                    Chào mừng đến với Nutrition App!
                </h1>
                <p className="text-lg text-gray-600 mb-8 text-center">
                    Quản lý chế độ ăn uống, theo dõi dinh dưỡng và cải thiện sức khỏe mỗi ngày.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f, idx) => (
                        <div
                            key={idx}
                            className={`rounded-2xl shadow-md bg-gradient-to-br ${f.color} p-6 flex flex-col items-center transition hover:scale-105 hover:shadow-xl`}
                        >
                            <img src={f.img} alt={f.title} className="w-16 h-16 mb-4" />
                            <h2 className="text-xl font-bold mb-2 text-gray-800 text-center">{f.title}</h2>
                            <p className="text-gray-600 mb-4 text-center text-sm">{f.desc}</p>
                            <Link
                                to={f.link}
                                className="mt-auto px-4 py-2 bg-emerald-500 text-white rounded-full font-semibold shadow hover:bg-emerald-600 transition"
                            >
                                Truy cập
                            </Link>
                        </div>
                    ))}
                   <div className="rounded-2xl shadow-md bg-gradient-to-br from-orange-100 to-orange-50 p-6 flex flex-col items-center col-span-1 md:col-span-2 lg:col-span-1">
                        <h2 className="text-xl font-bold mb-2 text-gray-800 text-center">Biểu đồ cân nặng</h2>
                        <div className="w-full h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={weightData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={[40, 60]} />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="weight" stroke="#ff914d" fill="#ff914d33" name="Trend" />
                                    <Line type="monotone" dataKey="weight" stroke="#ff914d" name="Weight (kg)" dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <span className="mt-2 text-sm text-gray-500">Cập nhật cân nặng của bạn theo thời gian</span>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default Home;