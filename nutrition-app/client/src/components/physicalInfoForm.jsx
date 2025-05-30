import React from 'react';
import usePhysicalInfo from '../hooks/usePhysicalInfo';

const PhysicalInfoForm = () => {
  const [status, setStatus] = React.useState('');
  const { info, handleChange, handleSubmit, loading, healthStats } = usePhysicalInfo(setStatus);

  const getBMIColor = (bmi) => {
    if (!bmi) return '';
    if (bmi < 18.5) return 'text-yellow-600';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-orange-600';
    return 'text-red-600';
  };

  const getActivityLevelDescription = () => {
    switch(info.activityLevel) {
      case 'Ít': return 'Ít hoặc không vận động';
      case 'Trung bình': return 'Vận động nhẹ 1-3 lần/tuần';
      case 'Nhiều': return 'Vận động nặng 3-5 lần/tuần';
      default: return '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Thông tin thể chất</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Chiều cao (cm)</label>
          <input 
            type="number" 
            name="height" 
            value={info.height} 
            onChange={handleChange} 
            className="w-full p-2 border rounded"
            min="100"
            max="250"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Cân nặng (kg)</label>
          <input 
            type="number" 
            name="weight" 
            value={info.weight} 
            onChange={handleChange} 
            className="w-full p-2 border rounded"
            min="30"
            max="200"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Tuổi</label>
          <input 
            type="number" 
            name="age" 
            value={info.age} 
            onChange={handleChange} 
            className="w-full p-2 border rounded"
            min="10"
            max="120"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Giới tính</label>
          <select 
            name="gender" 
            value={info.gender} 
            onChange={handleChange} 
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Chọn giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Mức độ hoạt động</label>
          <select 
            name="activityLevel" 
            value={info.activityLevel} 
            onChange={handleChange} 
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Chọn mức độ hoạt động</option>
            <option value="Ít">Ít</option>
            <option value="Trung bình">Trung bình</option>
            <option value="Nhiều">Nhiều</option>
          </select>
          {info.activityLevel && (
            <p className="text-xs text-gray-500 mt-1">{getActivityLevelDescription()}</p>
          )}
        </div>
      </div>
      
      {/* Health Stats Section */}
      {healthStats.bmi && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3">Chỉ số sức khỏe</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm">Chỉ số BMI:</p>
              <p className={`text-xl font-bold ${getBMIColor(healthStats.bmi)}`}>
                {healthStats.bmi} <span className="text-sm">({healthStats.bmiCategory})</span>
              </p>
            </div>
            
            <div>
              <p className="text-sm">Cân nặng lý tưởng:</p>
              <p className="text-lg font-semibold">
                {healthStats.idealWeightRange.min} - {healthStats.idealWeightRange.max} kg
              </p>
            </div>
            
            <div className="col-span-2">
              <p className="text-sm">Nhu cầu calo hàng ngày:</p>
              <p className="text-lg font-semibold">
                {healthStats.dailyCalorieNeeds} kcal
              </p>
            </div>
          </div>
          
          {/* Health warnings */}
          {healthStats.bmiCategory === 'Thiếu cân' && (
            <div className="mt-3 p-3 bg-yellow-100 rounded text-yellow-800">
              <p className="font-medium">⚠️ Cảnh báo: Thiếu cân</p>
              <p className="text-sm">BMI dưới 18.5 có thể ảnh hưởng đến sức khỏe. Bạn nên:</p>
              <ul className="list-disc pl-5 text-sm mt-1">
                <li>Tăng cường dinh dưỡng với thực phẩm giàu protein và carb lành mạnh</li>
                <li>Tập luyện sức mạnh để xây dựng cơ bắp</li>
                <li>Tham khảo ý kiến bác sĩ nếu cần thiết</li>
              </ul>
            </div>
          )}
          
          {healthStats.bmiCategory === 'Thừa cân' && (
            <div className="mt-3 p-3 bg-orange-100 rounded text-orange-800">
              <p className="font-medium">⚠️ Cảnh báo: Thừa cân</p>
              <p className="text-sm">BMI từ 25-29.9 có thể tăng nguy cơ sức khỏe. Bạn nên:</p>
              <ul className="list-disc pl-5 text-sm mt-1">
                <li>Tập thể dục ít nhất 30 phút mỗi ngày</li>
                <li>Giảm lượng calo tiêu thụ hàng ngày</li>
                <li>Ưu tiên thực phẩm giàu chất xơ và protein</li>
              </ul>
            </div>
          )}
          
          {healthStats.bmiCategory === 'Béo phì' && (
            <div className="mt-3 p-3 bg-red-100 rounded text-red-800">
              <p className="font-medium">⚠️ Cảnh báo: Béo phì</p>
              <p className="text-sm">BMI trên 30 làm tăng đáng kể nguy cơ sức khỏe. Bạn nên:</p>
              <ul className="list-disc pl-5 text-sm mt-1">
                <li>Tham khảo ý kiến bác sĩ hoặc chuyên gia dinh dưỡng</li>
                <li>Tăng cường hoạt động thể chất</li>
                <li>Đặt mục tiêu giảm cân lành mạnh 0.5-1kg mỗi tuần</li>
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-6 text-center">
        <button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          disabled={loading}
        >
          {loading ? 'Đang xử lý...' : 'Lưu thông tin'}
        </button>
        {status && <p className={`mt-2 ${status.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>{status}</p>}
      </div>
    </form>
  );
};

export default PhysicalInfoForm;