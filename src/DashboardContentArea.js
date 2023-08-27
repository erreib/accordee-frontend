import React from 'react';

const DashboardContentArea = ({ section, color, isActive }) => {
  return (
    <div className={`content-area ${isActive ? 'active' : ''}`} style={{ backgroundColor: color }}>
      {section}
    </div>
  );
};

export default DashboardContentArea;