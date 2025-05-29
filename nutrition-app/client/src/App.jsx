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
import Report from './pages/Report';
import IndexPage from './pages/Index'; // ✅ Trang giới thiệu

// Layout Component chứa Sidebar + Outlet
const Layout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const toggleSidebar = () => setCollapsed(!collapsed);

    return (
        <div className="flex min-h-screen">
            <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
            <div
                className={`transition-all duration-300 flex-1 bg-gray-100 ${collapsed ? 'ml-20' : 'ml-64'}`}
            >
                <Header />
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
            <Route path="/" element={<IndexPage />} /> {/* ✅ Trang landing */}
            <Route path="/login" element={<Login />} />
            <Route path="/signUpPage" element={<Signup />} />
            <Route path="/signup-info" element={<SignUpInfoPage />} />

            {/* Protected Routes */}
            <Route path="/app" element={<Layout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="food" element={<FoodSearch />} />
                <Route path="charts" element={<Charts />} />
                <Route path="profile" element={<Profile />} />
                <Route path="report" element={<Report />} />
                <Route path="*" element={<NotFound />} />
            </Route>

            {/* Redirect fallback nếu truy cập sai */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;
