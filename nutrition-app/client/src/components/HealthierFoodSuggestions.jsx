// src/components/HealthierFoodSuggestions.jsx
import { React, useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import '../styles/foodSearch.css';

const HealthierFoodSuggestions = ({ 
  selectedFoods, 
  totals, 
  token,
  onAddFood,
  autoSuggest, 
  onToggleAutoSuggest,
  autoSuggestDelay = 2000
}) => {
  const [healthierAlternatives, setHealthierAlternatives] = useState([]);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [isLoadingAlternatives, setIsLoadingAlternatives] = useState(false);
  const [error, setError] = useState(null);
  const searchTimeoutRef = useRef(null);

  const defaultCriteria = {
    increaseProtein: false,
    reduceFat: true,
    reduceCarbs: false,
    reduceCalories: true,
  };

  const [criteria, setCriteria] = useState(defaultCriteria);

  const handleCriteriaChange = (criterionName, value) => {
    setCriteria(prev => ({ ...prev, [criterionName]: value }));
  };

  // Sử dụng biến môi trường để cấu hình endpoint, nếu không có thì dùng mặc định
  const HEALTHIER_ALTERNATIVES_ENDPOINT = process.env.REACT_APP_HEALTHIER_ALTERNATIVES_ENDPOINT || '/api/foods/healthier-alternatives';

  const findHealthierAlternatives = useCallback(async () => {
    if (selectedFoods.length === 0) {
      setHealthierAlternatives([]);
      setShowAlternatives(false);
      setError(null);
      return;
    }

    setIsLoadingAlternatives(true);
    setError(null);

    try {
      if (!token) throw new Error('Token không hợp lệ.');

      const res = await axios.post(HEALTHIER_ALTERNATIVES_ENDPOINT, {
        currentNutrition: totals,
        currentFoods: selectedFoods.map(f => f.food_name),
        filters: criteria
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("API Response:", res.data);

      if (!res.data || !Array.isArray(res.data)) {
        throw new Error('API không trả về danh sách hợp lệ.');
      }

      const cleaned = res.data.map(food => ({
        food_name: food.food_name || 'Không rõ tên',
        nf_calories: food.nf_calories ?? food.calories ?? 0,
        nf_protein: food.nf_protein ?? food.protein ?? 0,
        nf_total_carbohydrate: food.nf_total_carbohydrate ?? food.carbs ?? 0,
        nf_total_fat: food.nf_total_fat ?? food.fat ?? 0,
      })).filter(f => f.food_name);

      setHealthierAlternatives(cleaned);
      setShowAlternatives(cleaned.length > 0);
    } catch (err) {
      // Kiểm tra lỗi 401 (usage limits exceeded) và 404
      if (err.response && err.response.status === 401) {
        setError('Usage limits exceeded. Vui lòng thử lại sau.');
      } else if (err.response && err.response.status === 404) {
        setError('Không tìm thấy gợi ý món ăn. Vui lòng kiểm tra URL API.');
      } else {
        setError(err.message || 'Lỗi khi tìm gợi ý.');
      }
      setHealthierAlternatives([]);
      setShowAlternatives(false);
    } finally {
      setIsLoadingAlternatives(false);
    }
  }, [selectedFoods, totals, token, criteria, HEALTHIER_ALTERNATIVES_ENDPOINT]);

  useEffect(() => {
    if (!autoSuggest) return;
    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(findHealthierAlternatives, autoSuggestDelay);
    return () => clearTimeout(searchTimeoutRef.current);
  }, [selectedFoods, totals, autoSuggest, findHealthierAlternatives, autoSuggestDelay]);

  return (
    <div className="healthier-suggestions-container">
      <div className="suggestion-controls">
        <label>
          <input type="checkbox" checked={autoSuggest} onChange={onToggleAutoSuggest} /> Tự động gợi ý
        </label>
        <button onClick={findHealthierAlternatives} disabled={isLoadingAlternatives || selectedFoods.length === 0}>
          {isLoadingAlternatives ? 'Đang tìm...' : '🍏 Gợi ý món lành mạnh'}
        </button>
        <div className="criteria-controls">
          {Object.keys(criteria).map(key => (
            <label key={key}>
              <input type="checkbox" checked={criteria[key]} onChange={e => handleCriteriaChange(key, e.target.checked)} /> {key}
            </label>
          ))}
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      {showAlternatives && Array.isArray(healthierAlternatives) && healthierAlternatives.length > 0 && (
        <div className="healthier-alternatives-panel">
          <h3>Gợi ý món ăn</h3>
          <button onClick={() => setShowAlternatives(false)}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          <div className="alternatives-grid">
            {healthierAlternatives.map((food, i) => (
              <div className="alternative-card" key={i}>
                <h4>{food.food_name}</h4>
                <p>Calo: {food.nf_calories}</p>
                <p>Protein: {food.nf_protein}</p>
                <p>Carbs: {food.nf_total_carbohydrate}</p>
                <p>Fat: {food.nf_total_fat}</p>
                <button onClick={() => onAddFood(food)}>
                  <FontAwesomeIcon icon={faPlus} /> Thêm món này
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthierFoodSuggestions;
