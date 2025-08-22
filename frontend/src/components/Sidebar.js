// src/components/Sidebar.js
import React from 'react';

const Sidebar = () => {
  // Static list of "features" or topics from the PDF
  const features = [
    { id: 'chat', name: 'Main Chat', description: 'Talk to your Penzi assistant' },
    { id: 'matches', name: 'Match Recommendations', description: 'View your potential matches' },
    { id: 'reports', name: 'Profile Insights', description: 'See your visibility reports' },
    { id: 'preferences', name: 'Matching Preferences', description: 'Adjust your settings' },
  ];

  return (
    <div className="app-sidebar">
      <div className="sidebar-header">
        <h2>Penzi Assistant</h2>
      </div>
      <div className="conversation-list">
        {features.map(feature => (
          <div key={feature.id} className="conversation-item">
            <strong>{feature.name}</strong>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;