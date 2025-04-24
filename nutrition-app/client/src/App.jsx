import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import Login from "./pages/login";
import Signup from "./pages/signUpPage";
import SignUpInfoPage from './pages/signUpInfoPage';
import Sidebar from './components/sidebar';
import Dashboard from './components/Dashboard';
import Charts from './components/charts';
import Profile from './components/profiles';
import Reports from './components/reports';

// Layout Component chứa Sidebar + Outlet
const Layout = () => (
    <div className="flex">
        <Sidebar />
        <div className="flex-1 p-6 bg-cream-100 min-h-screen">
            <Outlet />
        </div>
    </div>
);

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
                <Route path="*" element={<Dashboard />} />
            </Route>
        </Routes>
    );
};

export default App;
