import React from 'react';

const BasicLayout = ({ sections }) => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <ul>
        {sections.map((section, index) => (
          <li key={index}>
            <h3>{section.title}</h3>
            <p>{section.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BasicLayout;