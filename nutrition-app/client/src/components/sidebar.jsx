import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/sidebar.css';

const Sidebar = ({ collapsed, toggleSidebar }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div
            className={`fixed top-0 left-0 h-full bg-gray-900 text-white z-50 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'
                }`}
        >
            <div className="flex items-center justify-between p-4">
                {!collapsed && <span className="text-xl font-bold">Nutrition App</span>}
                <button onClick={toggleSidebar} className="text-white text-xl">☰</button>
            </div>

            <ul className="space-y-4 mt-6 pl-4">
                <li>
                    <Link to="/food" className="flex items-center gap-2 hover:text-teal-400">
                        <i className="fa-solid fa-utensils"></i>
                        {!collapsed && <span>Food</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/dashboard" className="flex items-center gap-2 hover:text-teal-400">
                        <i className="fas fa-tachometer-alt"></i>
                        {!collapsed && <span>Dashboard</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/profile" className="flex items-center gap-2 hover:text-teal-400">
                        <i className="fas fa-user"></i>
                        {!collapsed && <span>Profile</span>}
                    </Link>
                </li>
                <li>
                    <Link to="/settings" className="flex items-center gap-2 hover:text-teal-400">
                        <i className="fas fa-cogs"></i>
                        {!collapsed && <span>Settings</span>}
                    </Link>
                </li>
                <li>
                    <button onClick={handleLogout} className="flex items-center gap-2 hover:text-teal-400">
                        <i className="fas fa-sign-out-alt"></i>
                        {!collapsed && <span>Logout</span>}
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
