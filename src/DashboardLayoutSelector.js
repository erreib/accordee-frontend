import React, { useState } from 'react';

function DashboardLayoutSelector({ currentLayout, onChange }) {
  const layoutOptions = [
    { value: 'accordion', label: 'Accordion' },
    { value: 'tabbed', label: 'Tabbed' },
    // Add more layout options as needed
  ];

  return (
    <div>
      <label>Dashboard Layout:</label>
      <select value={currentLayout} onChange={(e) => onChange(e.target.value)}>
        {layoutOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default DashboardLayoutSelector;