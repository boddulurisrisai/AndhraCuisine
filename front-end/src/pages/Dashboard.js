// src/components/Dashboard.js

import React from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import ChatAssistant from './ChatAssistant';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <Sidebar />
      </div>
      <div className="main-content">
        <MainContent />
      </div>
      <div className="chat-assistant">
        <ChatAssistant />
      </div>
    </div>
  );
}

export default Dashboard;
