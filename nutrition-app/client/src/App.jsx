import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Sidebar from './components/sidebar';
import Dashboard from './components/Dashboard';
import Charts from './components/charts'; 
import Profile from './components/profiles'; 
import Reports from './components/reports';

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
