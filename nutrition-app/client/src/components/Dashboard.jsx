import React, { useState } from 'react';
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

import './dashboard.css';

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
    const [collapsed, setCollapsed] = useState(false); // quản lý trạng thái sidebar

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
            {/* Sidebar cố định */}
            {/* Nội dung dashboard */}
            <div
                className={`transition-all duration-300 ${collapsed ? 'ml-20' : 'ml-64'} flex-1 min-h-screen p-6 overflow-y-auto dashboard-container`}
            >
                <div className="flex justify-between items-center dashboard-header">
                    <h1>Your Dashboard</h1>
                    <div className="flex items-center">
                        <i className="fas fa-bell text-orange-500 mr-4"></i>
                        <a className="text-teal-600" href="#">Account</a>
                    </div>
                </div>

                <div className="dashboard-content">
                    <div className="dashboard-card h-64">
                        <h3>Energy Consumed</h3>
                        <Line data={energyHistoryData} options={options} />
                    </div>

                    <div className="dashboard-card h-64">
                        <h3>Weight History</h3>
                        <Line data={weightChangeData} options={options} />
                    </div>
                </div>

                <div className="dashboard-footer">
                    &copy; 2025 Nutrition App
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
