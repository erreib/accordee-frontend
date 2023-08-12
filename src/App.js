// src/App.js
import React, { useState, useEffect } from 'react';
import NavRow from './NavRow';
import ContentArea from './ContentArea';
import './App.css';

function App() {
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
        switch (e.keyCode) {
            case 37: // left arrow
            case 38: // up arrow
                const prevSection = selectedSection === null ? 3 : selectedSection === 0 ? null : selectedSection - 1;
                setSelectedSection(prevSection);
                break;
            case 39: // right arrow
            case 40: // down arrow
                const nextSection = selectedSection === null ? 0 : selectedSection === 3 ? null : selectedSection + 1;
                setSelectedSection(nextSection);
                break;
            default:
                break;
        }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
          // Clean up the event listener when the component is unmounted
          document.removeEventListener('keydown', handleKeyDown);
      };
    }, [selectedSection]);


  const sections = [
    { title: 'Section 1', color: '#FFCDD2' },
    { title: 'Section 2', color: '#C8E6C9' },
    { title: 'Section 3', color: '#BBDEFB' },
    { title: 'Section 4', color: '#FFECB3' },
  ];

  return (
    <div className="app">
      <NavRow title="react-accordion-site" color="#B0BEC5" onSelect={() => setSelectedSection(null)} isShrinked={selectedSection !== null} />
      {sections.map((section, index) => (
        <React.Fragment key={index}>
          <NavRow
            title={section.title}
            color={section.color}
            onSelect={() => setSelectedSection(index)}
            isShrinked={selectedSection !== null && selectedSection !== index}
            isSelected={selectedSection === index}
          />
          <ContentArea section={section.title} color={section.color} isActive={selectedSection === index} />
        </React.Fragment>
      ))}
    </div>
  );
}

export default App;
