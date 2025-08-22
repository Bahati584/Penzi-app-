import React from 'react';

const SMSMonitor = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>SMS Monitor</h2>
      <div className="message received">
        <p>Total Messages: 3,568</p>
        <p>Today: 45 messages</p>
        <p>Last hour: 12 messages</p>
      </div>
    </div>
  );
};

export default SMSMonitor;