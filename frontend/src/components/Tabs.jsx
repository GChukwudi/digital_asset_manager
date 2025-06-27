import React from 'react';
import '../styles/Tabs.css';

const Tabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'mint', label: 'Mint Asset', icon: '➕' },
    { id: 'assets', label: 'My Assets', icon: '📋' },
    { id: 'details', label: 'Asset Details', icon: '🔍' }
  ];

  return (
    <div className="tabs-container">
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
