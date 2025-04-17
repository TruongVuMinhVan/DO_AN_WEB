import React from 'react';
import { Link } from 'react-router-dom';  // Nếu bạn dùng React Router để điều hướng

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-5">
      <h2 className="text-2xl font-bold mb-6">Nutrition App</h2>
      
      <ul>
        <li className="mb-4">
          <Link to="/dashboard" className="flex items-center text-lg hover:text-teal-400">
            <i className="fas fa-tachometer-alt mr-3"></i>
            Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/profile" className="flex items-center text-lg hover:text-teal-400">
            <i className="fas fa-user mr-3"></i>
            Profile
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/settings" className="flex items-center text-lg hover:text-teal-400">
            <i className="fas fa-cogs mr-3"></i>
            Settings
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/logout" className="flex items-center text-lg hover:text-teal-400">
            <i className="fas fa-sign-out-alt mr-3"></i>
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
