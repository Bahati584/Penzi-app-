import React, { useState, useEffect } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import UserApp from './components/UserApp';
import './App.css';

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    setIsAdminAuthenticated(adminLoggedIn);
    setLoading(false);
  }, []);

  const handleAdminLogin = (success) => {
    setIsAdminAuthenticated(success);
    if (success) {
      localStorage.setItem('adminLoggedIn', 'true');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminLoggedIn');
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="app-loading">
        <div>Loading...</div>
      </div>
    );
  }

  // Show admin dashboard if authenticated
  if (isAdminAuthenticated) {
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  // Always show user app by default
  return <UserApp />;
}

export default App;