import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './sidebar';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import '../styles/dashboard.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // 🔐 Kiểm tra token ngay khi component mount
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [navigate, token]);

    const [collapsed, setCollapsed] = useState(false);
    const handleToggle = () => setCollapsed(!collapsed);

    const energyHistoryData = {
        labels: ["8 Apr", "10 Apr", "12 Apr", "14 Apr"],
        datasets: [{
            label: "Consumed",
            data: [0.1, 0.2, 0.3, 0.4],
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            fill: false,
        }],
    };

    const weightChangeData = {
        labels: ["8 Apr", "10 Apr", "12 Apr", "14 Apr"],
        datasets: [{
            label: "Weight",
            data: [60, 60, 60, 60],
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
            fill: false,
        }],
    };

    const options = {
        maintainAspectRatio: false,
        scales: {
            y: { beginAtZero: true },
        },
    };

    return (
        <div className="flex">
            {/* Sidebar có thể truyền collapsed và toggle */}
            {/* Nội dung dashboard */}
            <div
                className={`transition-all duration-300 flex-1 min-h-screen p-6 bg-gray-100 overflow-y-auto ${collapsed ? 'ml-20' : 'ml-64'
                    }`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Your Dashboard</h1>
                    <div className="flex items-center">
                        <i className="fas fa-bell text-orange-500 mr-4"></i>
                        <a className="text-teal-600" href="#">Account</a>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-4 rounded-xl shadow h-96">
                        <h3 className="text-lg font-medium mb-2">Energy Consumed</h3>
                        <Line data={energyHistoryData} options={options} />
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow h-96">
                        <h3 className="text-lg font-medium mb-2">Weight History</h3>
                        <Line data={weightChangeData} options={options} />
                    </div>
                </div>

                <footer className="text-center text-gray-500 mt-10">
                    &copy; 2025 Nutrition App
                </footer>
            </div>
        </div>
    );
};

export default Dashboard;
