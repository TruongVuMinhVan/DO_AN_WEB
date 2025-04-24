import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // ✅ useNavigate để chuyển hướng

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/login'); 
    };

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
                    <button
                        onClick={handleLogout}
                        className="flex items-center text-lg hover:text-teal-400 focus:outline-none"
                    >
                        <i className="fas fa-sign-out-alt mr-3"></i>
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
