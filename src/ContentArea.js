// src/ContentArea.js
import React from 'react';
import './ContentArea.css';

function ContentArea({ section, color, isActive }) {
  const adjustedColor = adjustColor(color);
  const className = isActive ? 'contentArea active' : 'contentArea';

  return (
    <div className={className} style={{ backgroundColor: adjustedColor }}>
      Content for {section}
    </div>
  );
}

function adjustColor(hex, amount = 30) {
  return '#' + hex.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

export default ContentArea;
