import React, { useState } from 'react';

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Simple hardcoded check (replace with API call)
    if (credentials.username === 'admin' && credentials.password === 'penziadmin2024') {
      onLogin(true);
      localStorage.setItem('adminLoggedIn', 'true');
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #FFF5EE 0%, #FFE4E1 100%)'
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 8px 30px rgba(180, 70, 100, 0.15)',
        width: '300px'
      }}>
        <h2 style={{ textAlign: 'center', color: '#E75480', marginBottom: '30px' }}>
          Penzi Admin Portal
        </h2>
        
        {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
        
        <input
          type="text"
          placeholder="Admin Username"
          value={credentials.username}
          onChange={(e) => setCredentials({...credentials, username: e.target.value})}
          style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '2px solid #FFD1DC' }}
        />
        
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '2px solid #FFD1DC' }}
        />
        
        <button type="submit" style={{
          width: '100%',
          padding: '12px',
          background: 'linear-gradient(135deg, #E75480 0%, #C9376F 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px'
        }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;