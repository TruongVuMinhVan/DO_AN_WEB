import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Reports = () => {
  const [reportData, setReportData] = useState([]);
  const [dateRange, setDateRange] = useState("7"); // default: 7 ngày
  const [loading, setLoading] = useState(false); // trạng thái loading
  const [error, setError] = useState(""); // trạng thái lỗi

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Đánh dấu là đang tải
      setError(""); // Reset lỗi trước khi fetch lại
      try {
        const res = await axios.get(`http://localhost:5000/api/reports?days=${dateRange}`);
        setReportData(res.data);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu báo cáo. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setLoading(false); // Kết thúc quá trình tải
      }
    };
    fetchData();
  }, [dateRange]);

  const data = {
    labels: reportData.map(item => item.date),
    datasets: [
      {
        label: "Calories Consumed",
        data: reportData.map(item => item.calories),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="p-6 bg-white rounded shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Báo cáo tiêu thụ calo</h2>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="7">7 ngày gần nhất</option>
          <option value="14">14 ngày gần nhất</option>
          <option value="30">30 ngày gần nhất</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center">Đang tải dữ liệu...</div> // Hiển thị khi đang tải
      ) : error ? (
        <div className="text-center text-red-500">{error}</div> // Hiển thị khi có lỗi
      ) : (
        <Line data={data} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
      )}
    </div>
  );
};

export default Reports;
