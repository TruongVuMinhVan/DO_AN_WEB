import React from "react";
import { Line } from 'react-chartjs-2';  // Sử dụng Line từ react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import "font-awesome/css/font-awesome.min.css";
import './dashboard.css';

// Đăng ký các thành phần cần thiết cho Chart.js
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
  // Dữ liệu cho biểu đồ Energy History
  const energyHistoryData = {
    labels: ["8 Apr", "10 Apr", "12 Apr", "14 Apr"],
    datasets: [
      {
        label: "Consumed",
        data: [0.1, 0.2, 0.3, 0.4],
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  // Dữ liệu cho biểu đồ Weight Change
  const weightChangeData = {
    labels: ["8 Apr", "10 Apr", "12 Apr", "14 Apr"],
    datasets: [
      {
        label: "Weight",
        data: [60, 60, 60, 60],
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        fill: false,
      },
    ],
  };

  // Cấu hình các tùy chọn cho biểu đồ
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
        {/* Copy sidebar HTML vào đây, thay `class` thành `className` */}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Your Dashboard</h1>
          <div className="flex items-center">
            <i className="fas fa-bell text-orange-500 mr-4"></i>
            <a className="text-teal-600" href="#">Account</a>
          </div>
        </div>

        {/* Các section khác */}
        <div className="mt-4">
          <Line data={energyHistoryData} options={options} id="energyHistoryChart" />
          <Line data={weightChangeData} options={options} className="mt-4" id="weightChangeChart" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
