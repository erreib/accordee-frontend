// TabContent.js
import React from 'react';

function TabContent({ content, isActive }) {
  return (
    <div className={`tab-content ${isActive ? 'active' : ''}`}>
      {isActive && (
        <div>
          {/* Render the content for the active tab */}
          <p>{content}</p>
        </div>
      )}
    </div>
  );
}

export default TabContent;
