import React, { useState } from 'react';
import { searchFood } from '../api/food';  
const FoodSearch = () => {
    const [q, setQ] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const foods = await searchFood(q);
            setResults(foods);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Tìm món ăn</h1>
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="Ví dụ: 1 apple, 200g rice..."
                    className="flex-1 p-2 border rounded"
                />
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                    Tìm
                </button>
            </form>

            {loading && <p>Đang tải…</p>}
            {error && <p className="text-red-500">{error}</p>}

            <div className="space-y-4">
                {results.map(food => (
                    <div key={food.food_name} className="p-4 bg-white rounded shadow">
                        <h2 className="font-bold">{food.food_name}</h2>
                        <p>Calo: {food.nf_calories} kcal</p>
                        <p>Đạm: {food.nf_protein} g</p>
                        <p>Carbs: {food.nf_total_carbohydrate} g</p>
                        <p>Chất béo: {food.nf_total_fat} g</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FoodSearch;
