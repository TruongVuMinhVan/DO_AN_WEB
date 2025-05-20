// src/pages/FoodSearch.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { searchFood } from '../api/food';
import NutritionPie from '../components/NutritionPie';
import '../styles/foodSearch.css';

const FoodSearch = () => {
    const [q, setQ] = useState('');
    const [results, setResults] = useState([]);
    const [history, setHistory] = useState([]);
    const [selectedFoods, setSelectedFoods] = useState([]);
    const [existingFoods, setExistingFoods] = useState([]);
    const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    const [showDropdown, setShowDropdown] = useState(false);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [detail, setDetail] = useState(null);
    // 1) Redirect nếu không có token
    useEffect(() => {
        if (!token) navigate('/login');
    }, [navigate, token]);

    // 2) Load lịch sử tìm kiếm
    useEffect(() => {
        if (!token) return;
        axios.get('/api/history', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setHistory(res.data))
            .catch(() => { });
    }, [token]);

    // 3) Load danh sách món có sẵn từ DB
    useEffect(() => {
        if (!token) return;
        (async () => {
            try {
                const res = await axios.get('/api/foods', { headers: { Authorization: `Bearer ${token}` } });
                setExistingFoods(res.data);
            } catch { }
        })();
    }, [token]);

    // 4) Click ngoài dropdown sẽ đóng
    useEffect(() => {
        const onClick = e => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    // 5) Recompute totals khi selectedFoods thay đổi
    useEffect(() => {
        const sums = selectedFoods.reduce((acc, f) => ({
            calories: acc.calories + (f.nf_calories || 0) * f.quantity,
            protein: acc.protein + (f.nf_protein || 0) * f.quantity,
            carbs: acc.carbs + (f.nf_total_carbohydrate || 0) * f.quantity,
            fat: acc.fat + (f.nf_total_fat || 0) * f.quantity,
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
        setTotals(sums);
    }, [selectedFoods]);

    // 6) Xử lý search form
    const handleSearch = async e => {
        e.preventDefault();
        if (!q.trim()) return;
        setShowDropdown(false);
        try {
        const foods = await searchFood(q);
        setResults(foods);
        // Cập nhật lịch sử, loại trùng
        await axios.post('/api/history', { query: q }, { headers: { Authorization: `Bearer ${token}` } });
        setHistory(h => {
            const exists = h.find(item => item.query.toLowerCase() === q.toLowerCase());
            if (exists) {
                return [
                    { ...exists, id: Date.now() },
                    ...h.filter(i => i.query.toLowerCase() !== q.toLowerCase())
                ];
            }
            return [{ id: Date.now(), query: q }, ...h];
        });

        } catch { }
        setDetail(null);
    };

    // 7) Thêm món vào selectedFoods (tăng quantity nếu đã có)
    const handleAddFood = food => {
        const key = food.nix_item_id || food.food_name;
        setSelectedFoods(prev => {
            const ex = prev.find(f => (f.nix_item_id || f.food_name) === key);
            if (ex) {
                return prev.map(f =>
                    (f.nix_item_id || f.food_name) === key
                        ? { ...f, quantity: f.quantity + 1 }
                        : f
                );
            }
            return [...prev, { ...food, quantity: 1 }];
        });
    };

    // 8) Tăng/giảm số lượng đã chọn
    const handleChangeQuantity = (key, delta) => {
        setSelectedFoods(prev =>
            prev.map(f =>
                (f.nix_item_id || f.food_name) === key
                    ? { ...f, quantity: Math.max(1, f.quantity + delta) }
                    : f
            )
        );
    };

    // 9) Chọn lại từ lịch sử
    const handleSelectHistory = item => {
        setQ(item.query);
        setShowDropdown(false);
        setTimeout(() => {
            wrapperRef.current.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true }));
        }, 0);
    };

    // 10) Xóa khỏi lịch sử
    const handleDeleteHistory = async id => {
        await axios.delete(`/api/history/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setHistory(h => h.filter(i => i.id !== id));
    };

    // 11) Lưu bữa ăn
    const handleSaveMeal = async () => {
        if (!selectedFoods.length) {
            return alert('Chưa có món nào để lưu!');
        }
        await axios.post(
            '/api/meals',
            { items: selectedFoods.map(f => ({ food_name: f.food_name, quantity: f.quantity })) },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('✅ Đã lưu bữa ăn!');
        setSelectedFoods([]);
    };

    // 12) Chọn món có sẵn
    const handleSelectExisting = async name => {
        setQ(name);
        setShowDropdown(false);
        const foods = await searchFood(name);
        setResults(foods);
    };

    const filteredHistory = q.trim()
        ? history.filter(h => h.query.toLowerCase().includes(q.toLowerCase()))
        : [];

    return (
        <div className="food-search-container">
            <h1 className="food-search-title">Tìm Kiếm Thức Ăn</h1>

            {/* Search + dropdown lịch sử */}
            <div ref={wrapperRef} className="food-search-wrapper">
                <form onSubmit={handleSearch} className="food-search-form">
                    <input
                        type="text"
                        value={q}
                        onChange={e => {
                            setQ(e.target.value);
                            setShowDropdown(e.target.value.trim().length > 0);
                        }}
                        placeholder="Ex: 1 apple, 200g rice..."
                        className="food-search-input"
                    />
                    <button type="submit" className="food-search-icon-btn">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </form>

                {showDropdown && filteredHistory.length > 0 && results.length === 0 && (
                    <ul className="history-dropdown">
                        {filteredHistory.map(item => (
                            <li key={item.id} className="history-item" onClick={() => handleSelectHistory(item)}>
                                <span>{item.query}</span>
                                <button
                                    className="history-delete-btn"
                                    onClick={e => { e.stopPropagation(); handleDeleteHistory(item.id); }}
                                    title="Xóa khỏi lịch sử"
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Grid layout */}
            <div className="grid-container">
                {/* Selected Foods Panel */}
                <div className="selected-list-panel">
                    <h3 className="panel-header">Thức ăn đã chọn</h3>
                    <ul>
                        {selectedFoods.map(f => {
                            const key = f.nix_item_id || f.food_name;
                            return (
                                <li key={key} className="selected-item">
                                    <div className="selected-item-inner">
                                        <span>{f.food_name} <strong>× {f.quantity}</strong></span>
                                        <div className="qty-controls">
                                            <button onClick={e => { e.stopPropagation(); handleChangeQuantity(key, -1); }}>−</button>
                                            <button onClick={e => { e.stopPropagation(); handleChangeQuantity(key, 1); }}>+</button>
                                            <button
                                                className="delete-btn"
                                                title="Xóa"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setSelectedFoods(prev => prev.filter(x => (x.nix_item_id || x.food_name) !== key));
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    <button className="btn-save-meal" onClick={handleSaveMeal}>💾 Lưu Bữa Ăn</button>
                </div>

                {/* Totals + Pie Chart */}
                <div className="totals-panel">
                    <h3 className="panel-header">Tổng dinh dưỡng</h3>
                    {['calories', 'protein', 'carbs', 'fat'].map(n => (
                        <div key={n} className="nutrient-line">
                            <span className={`dot dot-${n}`} />
                            <span className="nutrient-label">{n.charAt(0).toUpperCase() + n.slice(1)}:</span>
                            <strong>
                                {n === 'calories'
                                    ? `${totals[n].toFixed(2)} kcal`
                                    : `${totals[n].toFixed(2)} g`}
                            </strong>
                        </div>
                    ))}
                    <NutritionPie data={totals} />
                </div>
            </div>

            {/* Search Results */}
            <div className="search-results">
                {results.map(food => (
                    <div key={food.nix_item_id || food.food_name} className="food-card">
                        <h2>{food.food_name}</h2>
                        <p>Calo: {food.nf_calories} kcal</p>
                        <p>Protein: {food.nf_protein} g</p>
                        <p>Carbs: {food.nf_total_carbohydrate} g</p>
                        <p>Fat: {food.nf_total_fat} g</p>
                        <button className="add-food-btn" onClick={() => handleAddFood(food)} title="Thêm">
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Existing Foods Table */}
            <div className="existing-foods-table-container">
                <h3 className="panel-header">Món có sẵn</h3>
                <table className="existing-foods-table">
                    <thead><tr><th>Description</th><th>Source</th></tr></thead>
                    <tbody>
                        {existingFoods.map(item => (
                            <tr
                                key={item.id}
                                className="existing-food-row"
                                onClick={() => handleSelectExisting(item.ten_mon)}
                            >
                                <td>{item.ten_mon}</td>
                                <td>NCDB</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FoodSearch;
