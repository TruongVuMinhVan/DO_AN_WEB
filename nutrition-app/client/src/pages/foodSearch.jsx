// src/pages/FoodSearch.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faTrash, faXmark, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { searchFood } from '../api/food';
import NutritionPie from '../components/NutritionPie';
import '../styles/foodSearch.css';
//Import lịch ngày/tháng/năm
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
//Import cảnh báo popup
import Popup from '../components/Popup';


const FoodSearch = () => {
    const [q, setQ] = useState('');
    const [results, setResults] = useState([]);
    const [history, setHistory] = useState([]);
    const [detail, setDetail] = useState(null);
    const [selectedFoods, setSelectedFoods] = useState([]);
    const [existingFoods, setExistingFoods] = useState([]);
    const [selectedDescription, setSelectedDescription] = useState(null);
    const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    const [popup, setPopup] = useState({ open: false, message: '', success: true });
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
        const sums = selectedFoods.reduce((acc, f) => {
            const baseGram = f.serving_weight_grams ?? 100;
            const usedGram = f.custom_weight ?? baseGram;
            const ratio = usedGram / baseGram;

            const caloPerCustom = (f.nf_calories || 0) * ratio;
            const proteinPerCustom = (f.nf_protein || 0) * ratio;
            const carbsPerCustom = (f.nf_total_carbohydrate || 0) * ratio;
            const fatPerCustom = (f.nf_total_fat || 0) * ratio;

            const count = f.quantity ?? 1;
            return {
                calories: acc.calories + caloPerCustom * count,
                protein: acc.protein + proteinPerCustom * count,
                carbs: acc.carbs + carbsPerCustom * count,
                fat: acc.fat + fatPerCustom * count,
            };
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

        setTotals({
            calories: Math.round(sums.calories * 100) / 100,
            protein: Math.round(sums.protein * 100) / 100,
            carbs: Math.round(sums.carbs * 100) / 100,
            fat: Math.round(sums.fat * 100) / 100,
        });
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
                setSelectedFoods((res.data.items || []).map(f => ({
                    ...f,
                    quantity: f.quantity ?? 1
                })));
            } catch {
                setSelectedFoods([]);
            }
            setResults([]);
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
        if (!selectedFoods.length) return setPopup({ open: true, message: 'Chưa có món nào để lưu!', success: false });

        const dateStr = selectedDate.toISOString().slice(0, 10);
        const { data } = await axios.get('/api/meals', {
            headers: { Authorization: `Bearer ${token}` },
            params: { date: dateStr }
        });

        const method = data.items.length ? 'put' : 'post';
        const url = '/api/meals';
        const payload = {
            date: dateStr,
            items: selectedFoods.map(f => ({
                food_name: f.food_name,
                quantity: f.quantity ?? 1,
                custom_weight: f.custom_weight,
                nix_item_id: f.nix_item_id,
                nf_calories: f.nf_calories,
                nf_protein: f.nf_protein,
                nf_total_carbohydrate: f.nf_total_carbohydrate,
                nf_total_fat: f.nf_total_fat,
            }))
        };

        try {
            const res = await axios[method](url, payload, { headers: { Authorization: `Bearer ${token}` } });
            setPopup({ open: true, message: res.data.message, success: true });
        } catch {
            setPopup({ open: true, message: '❌ Không thể lưu! Vui lòng thử lại.', success: false });
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

    // 16) Lọc món trùng tên
    const uniqueFoods = existingFoods
        .filter(i => i.ten_mon)               
        .reduce((acc, item) => {
            const key = item.ten_mon.trim().toLowerCase();
            if (!acc.map.has(key)) {
                acc.map.set(key, true);
                acc.list.push(item);
            }
            return acc;
        }, { map: new Map(), list: [] }).list;

    // 17) Tính theo gam món
    const handleChangeWeight = (key, newWeightStr) => {
        const newWeight = Math.max(1, parseFloat(newWeightStr) || 0); // Ensure minimum weight is 1g
        setSelectedFoods(prev =>
            prev.map(f => {
                const fKey = f.nix_item_id || f.food_name;
                if (fKey === key) {
                    return { ...f, custom_weight: newWeight };
                }
                return f;
            })
        );
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
                            {selectedFoods.map((f, i) => {
                                const key = f.nix_item_id || f.food_name;
                                return (
                                    <li
                                        key={`${key}-${i}`}
                                        className="selected-item"
                                        onClick={() => {
                                            setResults(prev => {
                                                const exists = prev.some(item => (item.nix_item_id || item.food_name) === key);
                                                return exists ? prev : [...prev, f];
                                            });
                                        }}
                                    >
                                        <div className="selected-item-inner">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span>
                                                    {f.food_name} <strong>× {f.quantity}</strong>
                                                </span>
                                            </div>

                                            <div className="qty-controls">
                                                <button onClick={e => { e.stopPropagation(); handleChangeQuantity(key, -1); }}>−</button>
                                                <button onClick={e => { e.stopPropagation(); handleChangeQuantity(key, 1); }}>+</button>

                                                <input
                                                    type="number"
                                                    min="1"
                                                    placeholder={f.serving_weight_grams ? `${f.serving_weight_grams}g` : 'Khối lượng'}
                                                    value={f.custom_weight ?? ''}
                                                    onClick={e => e.stopPropagation()}
                                                    onChange={e => handleChangeWeight(key, e.target.value)}
                                                    style={{ width: '70px', padding: '2px 6px', marginLeft: '0.5rem' }}
                                                />

                                                <span style={{ marginLeft: '0.25rem' }}>(g)</span>

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

                    {/* Popup hiển thị ở cuối cùng */}
                    {popup.open && (
                        <Popup
                            message={popup.message}
                            success={popup.success}
                            onClose={() => setPopup({ ...popup, open: false })}
                        />
                    )}
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
                {results.map((food, i) => (
                    <div key={`${food.nix_item_id || food.food_name}-${i}`} className="food-card">
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
                        {uniqueFoods.map(item => (
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
