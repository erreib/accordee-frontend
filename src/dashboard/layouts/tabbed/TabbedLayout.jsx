// TabbedLayout.js
import React from 'react';
import NavTab from './NavTab';
import TabContent from './TabContent';

function TabbedLayout({ dashboard, selectedTab, setSelectedTab }) {
  return (
    <div className="tabbed-layout">
      <div className="tab-nav">
        {dashboard.sections.map((section, index) => (
          <NavTab
            key={index}
            title={section.title}
            isSelected={selectedTab === index}
            onClick={() => setSelectedTab(index)}
          />
        ))}
      </div>
      <div className="tab-content">
        {dashboard.sections.map((section, index) => (
          <TabContent
            key={index}
            content={section.content}
            isActive={selectedTab === index}
          />
        ))}
      </div>
    </div>
  );
}

export default TabbedLayout;
