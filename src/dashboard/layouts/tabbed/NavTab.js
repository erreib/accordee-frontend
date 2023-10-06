// NavTab.js
import React from 'react';

function NavTab({ title, isSelected, onClick }) {
  return (
    <div
      className={`nav-tab ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {title}
    </div>
  );
}

export default NavTab;
