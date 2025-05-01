import { Routes, Route, Outlet } from 'react-router-dom';
import React, { useState } from 'react';

import Login from "./pages/login";
import Signup from "./pages/signUpPage";
import SignUpInfoPage from './pages/signUpInfoPage';
import Sidebar from './components/sidebar';
import Dashboard from './components/Dashboard';
import Charts from './components/charts';
import Profile from './components/profiles';
import Reports from './components/reports';
import NotFound from './pages/notFound';

// Layout Component chứa Sidebar + Outlet
const Layout = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => setCollapsed(!collapsed);

    return (
        <div className="flex min-h-screen">
            <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
            <div
                className={`transition-all duration-300 flex-1 p-6 bg-gray-100 ${collapsed ? 'ml-20' : 'ml-64'
                    }`}
            >
                <Outlet />
            </div>
        </div>
    );
};

const App = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signUpPage" element={<Signup />} />
            <Route path="/signup-info" element={<SignUpInfoPage />} />

            {/* Protected Routes */}
            <Route path="/" element={<Layout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="charts" element={<Charts />} />
                <Route path="profile" element={<Profile />} />
                <Route path="reports" element={<Reports />} />
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
};

export default App;
