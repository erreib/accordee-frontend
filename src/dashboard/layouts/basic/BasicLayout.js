import React, { Suspense } from 'react';
import './BasicLayout.scss';
import SpinnerLoader from '../../../loaders/SpinnerLoader';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const BasicLayout = ({ sections }) => {
  const [animationParent] = useAutoAnimate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-inner-container">
        <ul>
          <Suspense fallback={<SpinnerLoader />}>
            <div ref={animationParent} className="sections-list">
              {sections.map((section, index) => (
                <li key={index}
                  style={{ borderLeft: `6px solid ${section.color}` }}
                >
                  <h3>{section.title}</h3>
                  <p>{section.content}</p>
                </li>
              ))}
            </div>
          </Suspense>
        </ul>
      </div>
    </div>
  );
};

export default BasicLayout;
