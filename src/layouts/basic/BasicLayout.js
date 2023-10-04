import React, { Suspense } from 'react';
import './BasicLayout.scss';
import SpinnerLoader from '../../loaders/SpinnerLoader';

const BasicLayout = ({ sections }) => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-inner-container">
        <ul>
          <Suspense fallback={<SpinnerLoader />}>
            {sections.map((section, index) => (
              <li key={index}
                style={{ borderLeft: `6px solid ${section.color}` }}
              >
                <h3>{section.title}</h3>
                <p>{section.content}</p>
              </li>
            ))}
          </Suspense>
        </ul>
      </div>
    </div>
  );
};

export default BasicLayout;
