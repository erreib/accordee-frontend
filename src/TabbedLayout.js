import React, { useState } from 'react';

function TabbedLayout({ sections }) {
  // State to keep track of the currently active tab
  const [activeTab, setActiveTab] = useState(0);

  // Function to handle tab clicks
  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="tabbed-layout">
      {/* Tab Headers */}
      <div className="tab-headers">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`tab-header ${index === activeTab ? 'active' : ''}`}
            onClick={() => handleTabClick(index)}
          >
            {section.title}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`tab-pane ${index === activeTab ? 'active' : ''}`}
          >
            {/* Display the section content here */}
            <h2>{section.title}</h2>
            <p>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TabbedLayout;
