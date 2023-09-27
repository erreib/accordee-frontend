// SkeletonLoader.js
import React from 'react';
import './SkeletonLoader.css'; // You can add styles for the skeleton loader in this CSS file

const SkeletonLoader = () => {
  return (
    <div className="skeleton-container">
      {/* Mimic Side Menu */}
      <div className="skeleton-side-menu"></div>

      {/* Mimic Main Content */}
      <div className="skeleton-main-content">
        {/* Mimic Header */}
        <div className="skeleton-header"></div>

        {/* Mimic Cards */}
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
