import React from 'react';
import './BasicLayout.scss';

const BasicLayout = ({ sections }) => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-inner-container">
        <ul>
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
    </div>
  );
};

export default BasicLayout;
