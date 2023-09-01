// AccordionLayout.js
import React from 'react';
import NavRow from './NavRow';
import ContentArea from './ContentArea';

function AccordionLayout({ dashboard, selectedSection, setSelectedSection }) {
    
  return (
    <div className="accordion">
      <NavRow
        title={dashboard.title}
        color="#B0BEC5"
        onSelect={() => setSelectedSection(null)}
        isShrinked={selectedSection !== null}
      />

      {dashboard.sections.map((section, index) => (
        <React.Fragment key={index}>
          <NavRow
            title={section.title}
            color={section.color}
            onSelect={() => setSelectedSection(index)}
            isShrinked={selectedSection !== null && selectedSection !== index}
            isSelected={selectedSection === index}
          />
          <ContentArea
            section={section} // Pass the entire section object, not just the title
            color={section.color}
            isActive={selectedSection === index}
          />
        </React.Fragment>
      ))}
    </div>
  );
}

export default AccordionLayout;
