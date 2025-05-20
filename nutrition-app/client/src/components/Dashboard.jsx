import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
// ...các import khác...

const TDEE = 2000; // Hoặc lấy từ user nếu muốn

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [energyHistory, setEnergyHistory] = useState([]);
    const [initialWeight, setInitialWeight] = useState(60); // Giá trị mặc định
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Lấy cân nặng ban đầu từ user
                const resUser = await fetch('/api/user/profile', {
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
                });
                const user = await resUser.json();
                setInitialWeight(user.weight || 60);

                // Lấy lịch sử năng lượng
                const resEnergy = await fetch('/api/meals/energy-history', {
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
                });
                const energyData = await resEnergy.json();
                setEnergyHistory(energyData);
            } catch (err) {
                setInitialWeight(60);
                setEnergyHistory([]);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    // Đồng bộ nhãn ngày
    const allDates = energyHistory.map(e => e.date);

    // Map dữ liệu năng lượng
    const energyMap = Object.fromEntries(energyHistory.map(e => [e.date, e.consumed]));

    // Tính toán cân nặng dựa trên lịch sử bữa ăn
    let weightArr = [];
    let accDelta = 0;
    for (let i = 0; i < allDates.length; i++) {
        const date = allDates[i];
        const consumed = energyMap[date] || 0;
        const delta = consumed - TDEE;
        accDelta += delta;
        const weight = initialWeight + accDelta / 7700;
        weightArr.push({ date, weight: Math.round(weight * 100) / 100 });
    }
    const weightMap = Object.fromEntries(weightArr.map(w => [w.date, w.weight]));

    // Chuẩn bị dữ liệu cho Chart.js
    const chartData = {
        labels: allDates,
        datasets: [
            {
                label: "Năng lượng tiêu thụ (kcal)",
                data: allDates.map(date => energyMap[date] || 0),
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderWidth: 2,
                fill: false,
                tension: 0.3,
                yAxisID: 'y',
            },
            {
                label: "Cân nặng ước lượng (kg)",
                data: allDates.map(date => weightMap[date] || null),
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderWidth: 2,
                fill: false,
                tension: 0.3,
                yAxisID: 'y1',
            }
        ],
    };

    const options = {
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: false,
                title: { display: true, text: 'Năng lượng (kcal)' }
            },
            y1: {
                beginAtZero: false,
                position: 'right',
                
                grid: { drawOnChartArea: false },
                title: { display: true, text: 'Cân nặng (kg)' }
            }
        },
        plugins: {
            legend: {
                display: true
            }
        }
    };

    return (
        <div className="flex">
            <div className="flex-1 min-h-screen p-6 bg-gray-100 overflow-y-auto">
                <h1 className="text-2xl font-semibold mb-6">Your Dashboard</h1>
                {loading ? (
                    <div className="text-center text-gray-500">Đang tải dữ liệu...</div>
                ) : (
                    <div className="space-y-8">
                        <div className="bg-white p-4 rounded-xl shadow h-96">
                            <h3 className="text-lg font-medium mb-2">Năng lượng & Cân nặng</h3>
                            <Line data={chartData} options={options} />
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow">
                            <h3 className="text-lg font-medium mb-2">Bảng tổng hợp năng lượng và cân nặng</h3>
                            <table className="min-w-full border text-center">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2">Ngày</th>
                                        <th className="border px-4 py-2">Năng lượng tiêu thụ (kcal)</th>
                                        <th className="border px-4 py-2">Cân nặng ước lượng (kg)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allDates.map((date, idx) => (
                                        <tr key={idx}>
                                            <td className="border px-4 py-2">{date}</td>
                                            <td className="border px-4 py-2">{energyMap[date] || 0}</td>
                                            <td className="border px-4 py-2">{weightMap[date] ?? ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;