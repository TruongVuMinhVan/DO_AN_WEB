import React from 'react';
import Sidebar from './components/sidebar';  // Import Sidebar component
import Dashboard from './components/Dashboard';  // Import Dashboard

const App = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-black-100">
        <h1 className="text-2xl font-semibold">Your Dashboard</h1>
        <Dashboard />  {/* Nội dung của Dashboard */}
      </div>
    </div>
  );
};

export default App;
