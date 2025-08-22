import React from 'react';

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

export default AdminSidebar;