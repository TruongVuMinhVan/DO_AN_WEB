import React, { useState } from 'react';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Login from "./pages/login";
import Signup from "./pages/signUpPage";
import SignUpInfoPage from './pages/signUpInfoPage';
import Sidebar from './components/sidebar';
import Dashboard from './components/Dashboard';
import Charts from './components/charts';
import Profile from './components/profiles';
import Reports from './components/reports';
import NotFound from './pages/notFound';
import FoodSearch from './pages/foodSearch';
import Header from './components/Header';

// Layout Component chứa Sidebar + Outlet
const Layout = () => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => setCollapsed(!collapsed);

    return (
        <div className="flex min-h-screen">
            <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
            <div
                className={`transition-all duration-300 flex-1 bg-gray-100 ${collapsed ? 'ml-20' : 'ml-64'
                    }`}
            >
                {/* ← Thêm Header ở đây */}
                <Header />
                {/* Phần chứa nội dung trang con */}
                <div className="p-6">
                    <Outlet />
                </div>
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

            <Route index element={<Navigate to="/login" />} /> {/* ✅ dùng index cho "/" */}
            {/* Protected Routes */}
            <Route path="/" element={<Layout />}> {/* sau này có trang home thì thay thế */}
                <Route path="/food" element={<FoodSearch />} /> 
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
