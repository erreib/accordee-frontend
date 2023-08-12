// src/App.js
import React, { useState, useEffect } from 'react'; // Add useEffect here if you intend to use it
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import NavRow from './NavRow';
import ContentArea from './ContentArea';
import Customization from './Customization';
import './App.css';

function App() {
  const sections = [
    { title: 'Section 1', color: '#FFCDD2' },
    { title: 'Section 2', color: '#C8E6C9' },
    { title: 'Section 3', color: '#BBDEFB' },
    { title: 'Section 4', color: '#D1C4E9' },
  ];

  const [selectedSection, setSelectedSection] = useState(null);
  const [title, setTitle] = useState('Loading...'); // Initial loading state

  useEffect(() => {
    fetch('http://localhost:5000/title')
      .then((response) => response.json())
      .then((data) => setTitle(data.title || 'Default Title')) // Directly access the title property
      .catch((error) => console.error('Error:', error));
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (selectedSection !== null) {
          const nextSection = selectedSection < sections.length - 1 ? selectedSection + 1 : null;
          setSelectedSection(nextSection);
        } else {
          setSelectedSection(0); // Select the first section if no section is currently selected
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (selectedSection !== null) {
          const prevSection = selectedSection > 0 ? selectedSection - 1 : null;
          setSelectedSection(prevSection);
        } else {
          setSelectedSection(sections.length - 1); // Select the last section if no section is currently selected
        }
      }
    };
  
    window.addEventListener('keydown', handleKeyPress);
  
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedSection, sections.length]);
  
  function CustomizeButton() {
    const location = useLocation();
    const isCustomizePage = location.pathname === '/customize';
    return (
      <Link
        to={isCustomizePage ? '/' : '/customize'}
        className="customize-button"
      >
        {isCustomizePage ? 'View Page' : 'Customize'}
      </Link>
    );
  }

  return (
    <Router>
      <div>
        <CustomizeButton />
        <Routes>
          <Route path="/customize" element={<Customization title={title} setTitle={setTitle} />} />
          <Route path="/" element={
            <div className="app">
            <NavRow title={title} color="#B0BEC5" onSelect={() => setSelectedSection(null)} isShrinked={selectedSection !== null} />
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
          } />
        </Routes>
      </div>
    </Router>
  );
  
}

export default App;

