import React, { useEffect } from 'react';
import './BasicLayout.scss';

const BasicLayout = ({ sections }) => {

  useEffect(() => {
    // Add a class to the body to apply dashboard-specific styles
    document.body.classList.add('basic-layout-body');

    // Cleanup function to remove the class when the dashboard is unmounted
    return () => {
      document.body.classList.remove('basic-layout-body');
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  return (
    <div className="dashboard-container">
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {sections.map((section, index) => (
          <li key={index}
          style={{borderLeft: `6px solid ${section.color}`}}
          >
            <h3>{section.title}</h3>
            <p>{section.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BasicLayout;
