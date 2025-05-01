import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                {!collapsed && <span className="title">Nutrition App</span>}
                <span className="toggle-btn" onClick={toggleSidebar}>☰</span>
            </div>
            <ul>
                <li>
                    <Link to="/dashboard" className="flex items-center text-lg hover:text-teal-400">
                        <i className="fas fa-tachometer-alt"></i>
                        <span>Dashboard</span>
                    </Link>
                </li>
                <li>
                    <Link to="/profile" className="flex items-center text-lg hover:text-teal-400">
                        <i className="fas fa-user"></i>
                        <span>Profile</span>
                    </Link>
                </li>
                <li>
                    <Link to="/settings" className="flex items-center text-lg hover:text-teal-400">
                        <i className="fas fa-cogs"></i>
                        <span>Settings</span>
                    </Link>
                </li>
                <li>
                    <button onClick={handleLogout} className="flex items-center text-lg hover:text-teal-400">
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
