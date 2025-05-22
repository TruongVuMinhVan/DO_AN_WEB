// src/pages/FoodSearch.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faTrash, faXmark, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { searchFood } from '../api/food';
import NutritionPie from '../components/NutritionPie';
import '../styles/foodSearch.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FoodSearch = () => {
    const [q, setQ] = useState('');
    const [results, setResults] = useState([]);
    const [history, setHistory] = useState([]);
    const [detail, setDetail] = useState(null);
    const [selectedFoods, setSelectedFoods] = useState([]);
    const [existingFoods, setExistingFoods] = useState([]);
    const [selectedDescription, setSelectedDescription] = useState(null);
    const [selectedExistingId, setSelectedExistingId] = useState(null);
    const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const wrapperRef = useRef(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

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

    // 6) Thêm effect để tải các món ăn theo ngày đã chọn
    useEffect(() => {
        if (!token || !selectedDate) return;
        const fetchMealByDate = async () => {
            const dateStr = selectedDate.toISOString().slice(0, 10);
            try {
                const res = await axios.get('/api/meals', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { date: dateStr }
                });
                setSelectedFoods(res.data.items || []);
            } catch (err) {
                console.error('Lỗi khi tải meal theo ngày:', err);
                setSelectedFoods([]);
            }
        };
        fetchMealByDate();
    }, [selectedDate, token]);

    // 7) Xử lý search form
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

    // 8) Thêm món vào selectedFoods (tăng quantity nếu đã có)
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

    // 9) Tăng/giảm số lượng đã chọn
    const handleChangeQuantity = (key, delta) => {
        setSelectedFoods(prev =>
            prev.map(f =>
                (f.nix_item_id || f.food_name) === key
                    ? { ...f, quantity: Math.max(1, f.quantity + delta) }
                    : f
            )
        );
    };

    // 10) Chọn lại từ lịch sử
    const handleSelectHistory = item => {
        setQ(item.query);
        setShowDropdown(false);
        setTimeout(() => {
            wrapperRef.current.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true }));
        }, 0);
    };

    // 11) Xóa khỏi lịch sử
    const handleDeleteHistory = async id => {
        await axios.delete(`/api/history/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        setHistory(h => h.filter(i => i.id !== id));
    };

    // 12) Lưu bữa ăn
    const handleSaveMeal = async () => {
        if (!selectedFoods.length) {
            return alert('Chưa có món nào để lưu!');
        }
        const dateStr = selectedDate.toISOString().slice(0, 10);
        const payload = {
            date: dateStr,
            items: selectedFoods.map(f => ({
                food_name: f.food_name,
                quantity: f.quantity,
                nf_calories: f.nf_calories,
                nf_protein: f.nf_protein,
                nf_total_carbohydrate: f.nf_total_carbohydrate,
                nf_total_fat: f.nf_total_fat
            }))
        };

        try {
            // Gọi PUT để upsert
            const res = await axios.put('/api/meals', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(res.data.message);
        } catch (err) {
            console.error(err);
            alert('❌ Không thể lưu bữa ăn. Vui lòng thử lại!');
        }
    };

    // 13) Chọn món có sẵn
    const handleSelectExisting = async (name) => {
        setSelectedDescription(name);
        setQ(name);
        setShowDropdown(false);
        try {
            const foods = await searchFood(name);
            setResults(foods);
        } catch (err) {
            console.error('Lỗi Nutritionix:', err);
        }
    };

    const filteredHistory = q.trim()
        ? history.filter(h => h.query.toLowerCase().includes(q.toLowerCase()))
        : [];

    // 14) Chọn ngày hôm trước
    const handlePrevDay = () => {
        const prevDate = new Date(selectedDate);
        prevDate.setDate(prevDate.getDate() - 1);
        setSelectedDate(prevDate);
    };

    // 15) Chọn ngày hôm sau
    const handleNextDay = () => {
        const nextDate = new Date(selectedDate);
        nextDate.setDate(nextDate.getDate() + 1);
        setSelectedDate(nextDate);
    };


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
                    <div className="selected-panel-top">
                        <h3 className="panel-header">Thức ăn đã chọn</h3>
                        <div className="meal-date-picker-fixed">
                            <button onClick={handlePrevDay} className="date-nav-btn">
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>

                            <DatePicker
                                selected={selectedDate}
                                onChange={date => setSelectedDate(date)}
                                dateFormat="dd/MM/yyyy"
                                className="date-input"
                            />

                            <button onClick={handleNextDay} className="date-nav-btn">
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <ul style={{ flex: 1 }}>
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
                    </div>

                    <button className="btn-save-meal" onClick={handleSaveMeal}>Lưu Bữa Ăn</button>
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
                    <thead>
                        <tr><th>Description</th><th>Source</th></tr>
                    </thead>
                    <tbody>
                        {existingFoods.map(item => (
                            // Ví dụ trong FoodSearch.jsx
                            <tr
                                key={item.id}
                                className={`existing-food-row${selectedDescription === item.ten_mon ? ' selected' : ''}`}
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
