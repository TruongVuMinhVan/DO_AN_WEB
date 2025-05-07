// src/pages/FoodSearch.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { searchFood } from '../api/food';
import '../styles/foodSearch.css';

const FoodSearch = () => {
    const [q, setQ] = useState('');
    const [results, setResults] = useState([]);
    const [history, setHistory] = useState([]);
    const [selectedFoods, setSelectedFoods] = useState([]);
    const [detail, setDetail] = useState(null);
    const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    const [showDropdown, setShowDropdown] = useState(false);
    const wrapperRef = useRef(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) navigate('/login');
    }, [navigate, token]);

    // Fetch history
    useEffect(() => {
        if (!token) return;
        (async () => {
            try {
                const res = await axios.get('/api/history', { headers: { Authorization: `Bearer ${token}` } });
                setHistory(res.data);
            } catch { }
        })();
    }, [token]);

    // Click outside để ẩn dropdown
    useEffect(() => {
        const onClick = e => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, []);

    // Tính tổng khi selectedFoods thay đổi
    useEffect(() => {
        const sums = selectedFoods.reduce((acc, f) => ({
            calories: acc.calories + (f.nf_calories || 0) * f.quantity,
            protein: acc.protein + (f.nf_protein || 0) * f.quantity,
            carbs: acc.carbs + (f.nf_total_carbohydrate || 0) * f.quantity,
            fat: acc.fat + (f.nf_total_fat || 0) * f.quantity
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
        setTotals(sums);
    }, [selectedFoods]);

    const handleSearch = async e => {
        e.preventDefault();
        if (!q.trim()) return;
        setShowDropdown(false);
        try {
            const foods = await searchFood(q);
            setResults(foods);
            await axios.post('/api/history', { query: q }, { headers: { Authorization: `Bearer ${token}` } });
            setHistory(h => [{ id: Date.now(), query: q }, ...h]);
        } catch { }
        setDetail(null);
    };

    // Thêm hoặc tăng số lượng dựa trên nix_item_id
    const handleAddFood = food => {
        setSelectedFoods(prev => {
            const existing = prev.find(f => f.nix_item_id === food.nix_item_id);
            if (existing) {
                return prev.map(f =>
                    f.nix_item_id === food.nix_item_id
                        ? { ...f, quantity: f.quantity + 1 }
                        : f
                );
            }
            return [...prev, { ...food, quantity: 1 }];
        });
    };

    const handleChangeQuantity = (id, delta) => {
        setSelectedFoods(prev =>
            prev.map(f =>
                f.nix_item_id === id
                    ? { ...f, quantity: Math.max(1, f.quantity + delta) }
                    : f
            )
        );
    };

    const handleSelectFood = food => {
        setDetail(food);
    };

    const handleSelectHistory = item => {
        setQ(item.query);
        setShowDropdown(false);
        setTimeout(() => {
            wrapperRef.current.querySelector('form')
                .dispatchEvent(new Event('submit', { bubbles: true }));
        }, 0);
    };

    const handleDeleteHistory = async id => {
        try {
            await axios.delete(`/api/history/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setHistory(prev => prev.filter(h => h.id !== id));
        } catch (err) {
            console.error('Xoá lỗi:', err);
        }
    };

    const handleSaveMeal = async () => {
        if (!selectedFoods.length) {
            alert('Chưa có món nào để lưu!');
            return;
        }
        try {
            await axios.post(
                '/api/meals',
                { items: selectedFoods.map(f => ({ food_name: f.food_name, quantity: f.quantity })) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('✅ Saved your meal!');
            setSelectedFoods([]);
            setTotals({ calories: 0, protein: 0, carbs: 0, fat: 0 });
            setDetail(null);
        } catch (err) {
            console.error(err);
            alert('❌ Lỗi khi lưu bữa ăn.');
        }

    };
    const filteredHistory = q.trim()
        ? history.filter(h => h.query.toLowerCase().includes(q.toLowerCase()))
        : [];

    return (
        <div className="food-search-container">
            <h1 className="food-search-title">Food Search</h1>

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
                            <li
                                key={item.id}
                                className="history-item"
                                onClick={() => handleSelectHistory(item)}
                            >
                                <span>{item.query}</span>
                                <button
                                    className="history-delete-btn"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleDeleteHistory(item.id);
                                    }}
                                    title="Xóa khỏi lịch sử"
                                >
                                    ❌
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="grid-container">
                <div className="selected-list-panel">
                    <h3 className="panel-title">Selected Foods</h3>
                    <ul>
                        {selectedFoods.map(food => (
                            <li
                                key={food.nix_item_id}
                                className="selected-item"
                                onClick={() => handleSelectFood(food)}
                            >
                                <div className="selected-item-inner">
                                    <span>
                                        {food.food_name} <strong>× {food.quantity}</strong>
                                    </span>
                                    <div className="qty-controls">
                                        <button onClick={e => { e.stopPropagation(); handleChangeQuantity(food.nix_item_id, -1); }}>−</button>
                                        <button onClick={e => { e.stopPropagation(); handleChangeQuantity(food.nix_item_id, 1); }}>+</button>
                                        <button className="delete-btn" onClick={e => {
                                            e.stopPropagation();
                                            setSelectedFoods(prev => prev.filter(f => f.nix_item_id !== food.nix_item_id));
                                        }}>
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="totals-panel">
                    <h3 className="panel-title">Totals</h3>
                    <p>Calories: <strong>{totals.calories.toFixed(2)}</strong> kcal</p>
                    <p>Protein: <strong>{totals.protein.toFixed(2)}</strong> g</p>
                    <p>Carbs: <strong>{totals.carbs.toFixed(2)}</strong> g</p>
                    <p>Fat: <strong>{totals.fat.toFixed(2)}</strong> g</p>
                </div>

                <div className="reserved-panel detail-panel">
                    <h3 className="panel-title">Detail</h3>
                    {detail ? (
                        <>
                            <p><strong>{detail.food_name}</strong></p>
                            <p>Calories: {detail.nf_calories} kcal</p>
                            <p>Protein: {detail.nf_protein} g</p>
                            <p>Carbs: {detail.nf_total_carbohydrate} g</p>
                            <p>Fat: {detail.nf_total_fat} g</p>
                        </>
                    ) : (
                        <p>Click vào món trong danh sách để xem chi tiết</p>
                    )}
                </div>
            </div>

            <div className="search-results">
                {results.map(food => (
                    <div key={food.nix_item_id} className="food-card">
                        <h2>{food.food_name}</h2>
                        <p>Calo: {food.nf_calories} kcal</p>
                        <p>Protein: {food.nf_protein} g</p>
                        <p>Carbs: {food.nf_total_carbohydrate} g</p>
                        <p>Fat: {food.nf_total_fat} g</p>
                        <button
                            className="add-food-btn"
                            onClick={() => handleAddFood(food)}
                            title="Add"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FoodSearch;
