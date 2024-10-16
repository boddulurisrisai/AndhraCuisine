// src/components/Sidebar.js

import React from 'react';

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Food Cuisine</h2>
      <nav>
        <ul>
          <li>Home</li>
          <li>Menu</li>
          <li>Orders</li>
          <li>Profile</li>
          <li>Settings</li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
