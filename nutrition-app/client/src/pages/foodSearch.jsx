import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { searchFood } from '../api/food';

const FoodSearch = () => {
    const [q, setQ] = useState('');
    const [results, setResults] = useState([]);
    const [history, setHistory] = useState([]); // ✅ đúng vị trí
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [isAuthorized, setIsAuthorized] = useState(true);

    useEffect(() => {
        if (!token) navigate('/login');
    }, [navigate]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        let foods;
        try {
            // Gọi Nutritionix
            foods = await searchFood(q);
            setResults(foods);
        } catch (err) {
            setError("Không thể lấy dữ liệu dinh dưỡng.");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                "/api/history",
                { query: q },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.warn("⚠️ Lỗi lưu lịch sử tìm kiếm:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return navigate('/login');

        const fetchHistory = async () => {
            try {
                const res = await axios.get("/api/history", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setHistory(res.data);
            } catch (err) {
                console.warn("⚠️ Không thể tải lịch sử:", err.message);
            }
        };

        fetchHistory();
    }, [navigate]);

    if (!isAuthorized) return null;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Search Food</h1>

            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="Ex: 1 apple, 200g rice..."
                    className="flex-1 p-2 border rounded"
                />
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                    Search
                </button>
            </form>

            {/* ✅ Hiển thị lịch sử */}
            {history.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold">Lịch sử tìm kiếm gần đây:</h3>
                    <ul className="list-disc pl-5 text-gray-700">
                        {history.slice(0, 5).map((item, i) => (
                            <li
                                key={i}
                                onClick={() => {
                                    setQ(item.query);
                                    setTimeout(() => {
                                        document.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true }));
                                    }, 0);
                                }}
                                className="cursor-pointer hover:underline"
                            >
                                {item.query}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {loading && <p>Loading…</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="space-y-4">
                {results.map(food => (
                    <div key={food.food_name} className="p-4 bg-white rounded shadow">
                        <h2 className="font-bold">{food.food_name}</h2>
                        <p>Calo: {food.nf_calories} kcal</p>
                        <p>Protein: {food.nf_protein} g</p>
                        <p>Carbs: {food.nf_total_carbohydrate} g</p>
                        <p>Fat: {food.nf_total_fat} g</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FoodSearch;
