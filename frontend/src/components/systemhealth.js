import React from 'react';

const SystemHealth = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>System Health</h2>
      <div className="message received">
        <p>🟢 Database: Connected</p>
        <p>🟢 API: Running</p>
        <p>🟢 Memory: Stable</p>
        <p>🟢 Uptime: 12 hours</p>
      </div>
    </div>
  );
};

export default SystemHealth;