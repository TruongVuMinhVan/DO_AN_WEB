import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Sidebar from './components/sidebar';
import Dashboard from './components/Dashboard';
import Charts from './components/charts'; 
import Profile from './components/profiles'; 
import Reports from './components/reports';
<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes

const App = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-cream-100 min-h-screen">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
