import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userAPI.getAllUsers();
      setUsers(data.users);
      
      // Calculate stats
      const total = data.users.length;
      const completed = data.users.filter(user => 
        (user.registrationStage === 'completed' || 
        (user.description && user.levelOfEducation))
      ).length;

      setStats({ total, completed, pending: total - completed });
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="message received">Loading users...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h3>User Management</h3>
      
      {/* Statistics Dashboard */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ padding: '15px', background: '#FFD1DC', borderRadius: '10px', flex: 1 }}>
          <h4>Total Users</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total}</p>
        </div>
        <div style={{ padding: '15px', background: '#DCEDC8', borderRadius: '10px', flex: 1 }}>
          <h4>Completed Profiles</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.completed}</p>
        </div>
        <div style={{ padding: '15px', background: '#FFECB3', borderRadius: '10px', flex: 1 }}>
          <h4>Pending Completion</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.pending}</p>
        </div>
      </div>

      {/* Users List */}
      <div className="user-list">
        {users.map(user => (
          <div key={user._id} className="conversation-item">
            <strong>{user.name} ({user.age})</strong>
            <p>📞 {user.phone} | 📍 {user.town}, {user.county}</p>
            <p>Stage: {user.registrationStage || 'basic_info'}</p>
            <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
            
            <button 
              onClick={() => handleDeleteUser(user._id)}
              style={{ 
                marginTop: '10px', 
                padding: '5px 10px', 
                borderRadius: '5px', 
                border: 'none', 
                backgroundColor: '#ff4444', 
                color: 'white' 
              }}
            >
              Delete User
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;