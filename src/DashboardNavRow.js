import React from 'react';

const DashboardNavRow = ({ title, color, onSelect, isSelected, isShrinked }) => {
  const handleClick = () => {
    onSelect();
  };

  return (
    <div
      className={`nav-row ${isShrinked ? 'shrinked' : ''}`}
      style={{ backgroundColor: color }}
      onClick={handleClick}
    >
      <span className={`nav-row-title ${isSelected ? 'selected' : ''}`}>{title}</span>
    </div>
  );
};

export default DashboardNavRow;
