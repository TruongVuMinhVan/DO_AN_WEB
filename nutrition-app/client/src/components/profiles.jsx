import React, { useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: '',
    gender: ''
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', user);
      alert("Lưu thành công!");
    } catch (error) {
      console.error(error);
      alert("Lưu thất bại!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-teal-600 mb-4">Cập nhật hồ sơ</h2>

      <input type="text" name="name" placeholder="Họ tên" value={user.name} onChange={handleChange}
        className="block w-full mb-3 p-2 border rounded" />

      <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange}
        className="block w-full mb-3 p-2 border rounded" />

      <input type="number" name="age" placeholder="Tuổi" value={user.age} onChange={handleChange}
        className="block w-full mb-3 p-2 border rounded" />

      <select name="gender" value={user.gender} onChange={handleChange}
        className="block w-full mb-3 p-2 border rounded">
        <option value="">Chọn giới tính</option>
        <option value="Nam">Nam</option>
        <option value="Nữ">Nữ</option>
      </select>

      <button type="submit" className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600">
        Lưu
      </button>
    </form>
  );
};

export default Profile;
