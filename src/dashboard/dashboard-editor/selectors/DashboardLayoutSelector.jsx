import React from 'react';

function DashboardLayoutSelector({ currentLayout, onChange }) {
  const layoutOptions = [
    { value: 'basic', label: 'Basic', imageUrl: 'https://via.placeholder.com/150' },
    { value: 'accordion', label: 'Accordion', imageUrl: 'https://via.placeholder.com/150' },
    { value: 'tabbed', label: 'Tabbed', imageUrl: 'https://via.placeholder.com/150' },
    // Add more layout options as needed
  ];

  return (
    <>
      <label>Dashboard Layout:</label>
      <div className="layout-grid">
        {layoutOptions.map((option) => (
          <div
            key={option.value}
            className={`layout-item ${currentLayout === option.value ? 'active' : ''}`}
            onClick={() => onChange(option.value)}
          >
            <img src={option.imageUrl} alt={option.label} />
            <span>{option.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default DashboardLayoutSelector;
