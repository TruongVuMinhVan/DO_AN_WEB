import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { searchFood } from '../api/food';

const FoodSearch = () => {
    const [q, setQ] = useState('');
    const [results, setResults] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef(null);
    const token = localStorage.getItem('token');

    // 1. Redirect nếu chưa login
    useEffect(() => {
        if (!token) navigate('/login');
    }, [navigate, token]);

    // 2. Fetch history khi mount
    useEffect(() => {
        async function fetchHistory() {
            try {
                const res = await axios.get('/api/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistory(res.data);
            } catch (err) {
                console.warn('Không lấy được lịch sử:', err);
            }
        }
        if (token) fetchHistory();
    }, [token]);

    // 3. Click ngoài để ẩn dropdown
    useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 4. Khi submit form
    const handleSearch = async e => {
        e.preventDefault();
        // Ẩn dropdown khi tìm kiếm
        setShowDropdown(false);

        setLoading(true);
        setError('');
        try {
            const foods = await searchFood(q);
            setResults(foods);

            // lưu lịch sử lên server
            await axios.post(
                '/api/history',
                { query: q },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // cập nhật local ngay
            setHistory(prev => [{ id: Date.now(), query: q }, ...prev]);
        } catch (err) {
            setError('Không thể lấy dữ liệu dinh dưỡng.');
        } finally {
            setLoading(false);
        }
    };

    // 5. Chọn từ dropdown
    const handleSelect = item => {
        setQ(item.query);
        setShowDropdown(false);
        setTimeout(() => {
            wrapperRef.current.querySelector('form').dispatchEvent(
                new Event('submit', { bubbles: true })
            );
        }, 0);
    };

    // 6. Xoá item
    const handleDelete = async id => {
        try {
            await axios.delete(`/api/history/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(prev => prev.filter(h => h.id !== id));
        } catch (err) {
            console.error('Xoá lỗi:', err);
        }
    };

    // 7. Lọc history theo q
    const filtered = history.filter(h =>
        h.query.toLowerCase().includes(q.toLowerCase())
    );

    return (
        <div className="p-6 overflow-hidden">
            <h1 className="text-2xl font-semibold mb-4">Food Search:</h1>
            <div ref={wrapperRef} className="relative mb-4">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={q}
                        onChange={e => {
                            setQ(e.target.value);
                            setShowDropdown(true);
                        }}
                        onFocus={() => setShowDropdown(true)}
                        placeholder="Ex: 1 apple, 200g rice..."
                        className="flex-1 p-2 border rounded"
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                        Search
                    </button>
                </form>

                { /* Dropdown chỉ hiện khi đang gõ (q không rỗng) và chưa có kết quả */}
                {showDropdown && q.trim() !== '' && filtered.length > 0 && results.length === 0 && (
                    <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 shadow-lg rounded h-64 overflow-auto z-10">
                        {filtered.map(item => (
                            <li
                                key={item.id}
                                className="flex justify-between items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => handleSelect(item)}
                            >
                                <span>{item.query}</span>
                                <button
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleDelete(item.id);
                                    }}
                                    className="text-gray-400 hover:text-red-500"
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {loading && <p>Loading…</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="space-y-4 overflow-y-auto max-h-[60vh]">
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
