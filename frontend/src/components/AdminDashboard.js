import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    const mockStats = {
      totalUsers: 1247,
      totalMessages: 3568,
      totalMatches: 892,
      todayRegistrations: 23,
      activeToday: 187,
      systemHealth: 'optimal'
    };
    setStats(mockStats);
  };

  const AdminSidebar = ({ activeTab, onSelectTab }) => {
    const menuItems = [
      { id: 'dashboard', name: 'Dashboard', icon: '📊' },
      { id: 'users', name: 'User Management', icon: '👥' },
      { id: 'sms', name: 'SMS Monitor', icon: '💬' },
      { id: 'health', name: 'System Health', icon: '❤️' },
      { id: 'analytics', name: 'Analytics', icon: '📈' },
    ];
  
    return (
      <div className="app-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <div className="conversation-list">
          {menuItems.map(item => (
            <div
              key={item.id}
              className={`conversation-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <span style={{ marginRight: '10px' }}>{item.icon}</span>
              <strong>{item.name}</strong>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'health': return <div><h3>System Health</h3><p>All systems operational</p></div>;
      case 'users': return <div><h3>User Management</h3><p>User management panel</p></div>;
      case 'sms': return <div><h3>SMS Monitor</h3><p>SMS monitoring panel</p></div>;
      case 'analytics': return <div><h3>Analytics</h3><p>Analytics dashboard</p></div>;
      default: return <DashboardHome stats={stats} />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Penzi Admin Dashboard</h1>
        <button onClick={onLogout} style={{
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          color: 'white',
          padding: '8px 15px',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Logout
        </button>
      </header>
      
      <div className="app-body">
        <AdminSidebar activeTab={activeTab} onSelectTab={setActiveTab} />
        <div className="app-chatarea">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// Dashboard Home Component
const DashboardHome = ({ stats }) => (
  <div style={{ padding: '20px' }}>
    <h2>System Overview</h2>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
      <DashboardCard title="Total Users" value={stats.totalUsers} color="#E75480" />
      <DashboardCard title="Total Messages" value={stats.totalMessages} color="#4CAF50" />
      <DashboardCard title="Successful Matches" value={stats.totalMatches} color="#2196F3" />
      <DashboardCard title="Today's Registrations" value={stats.todayRegistrations} color="#FF9800" />
      <DashboardCard title="Active Today" value={stats.activeToday} color="#9C27B0" />
      <DashboardCard title="System Status" value={stats.systemHealth} color="#00BCD4" />
    </div>
  </div>
);

const DashboardCard = ({ title, value, color }) => (
  <div style={{
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center'
  }}>
    <h3 style={{ color, margin: '0 0 10px 0' }}>{value}</h3>
    <p style={{ margin: 0, color: '#666' }}>{title}</p>
  </div>
);

export default AdminDashboard;