// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom'; // Add useLocation
import axios from 'axios'; // Import axios
import NavRow from './NavRow';
import ContentArea from './ContentArea';
import Customization from './Customization';
import Signup from './Signup';
import Dashboard from './Dashboard';
import DashboardEditor from './DashboardEditor';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './App.css';

// Place usePrevious function here
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function App() {

  const [selectedSection, setSelectedSection] = useState(null);
  const [title, setTitle] = useState('Loading...'); // Initial loading state
  const [sections, setSections] = useState([]); // Initialize as empty array
  const [refreshKey, setRefreshKey] = useState(0); // Initialize to 0

  useEffect(() => {
    axios.get('http://localhost:5000/title').then((response) => {
      if (response.data && response.data.title) {
        setTitle(response.data.title);
      }
    });

    // Fetch data from your server when the component mounts
    fetch("http://localhost:5000/sections")
      .then((response) => response.json())
      .then((data) => {
        const fetchedSections = data.sections; // Here, we extract the 'sections' array from the fetched data
        if (Array.isArray(fetchedSections)) {
          setSections(fetchedSections);
        }
      })
      .catch((error) => console.error("Error fetching data: ", error));
    }, [refreshKey]); // Now useEffect runs whenever refreshKey changes

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
    const isRoot = location.pathname === '/';
    
    const handleClick = () => {
      setRefreshKey((prevKey) => prevKey + 1); // Increment refreshKey to trigger data fetching
    };
  
    if (!isRoot && !isCustomizePage) return null;
  
    return (
      <Link
        to={isCustomizePage ? '/' : '/customize'}
        className="customize-button"
        onClick={handleClick}
      >
        {isCustomizePage ? 'View Page' : 'Customize'}
      </Link>
    );
  }
  
  function SignupButton() {
    const location = useLocation();
    const isSignupPage = location.pathname === '/signup';
    const isRoot = location.pathname === '/';
    const isCustomizePage = location.pathname === '/customize';  // Define it here too
  
    if (!isRoot && !isCustomizePage) return null;
  
    return (
      <Link
        to={isSignupPage ? '/' : '/signup'}
        className="signup-button"
      >
        {isSignupPage ? 'Go to Home' : 'Signup'}
      </Link>
    );
  }

  function AnimatedSwitch() {
    const location = useLocation();
    const prevLocation = usePrevious(location) || location; // set a default value
    
    let key = location.pathname;
    let classNames = 'slide';
    
    // Only determine slide direction based on location change if prevLocation exists
    if (prevLocation && location.pathname !== prevLocation.pathname) {
      const goingToEdit = location.pathname.includes('/edit');
      const comingFromEdit = prevLocation.pathname.includes('/edit');
  
      // If going to edit screen, slide to the left; otherwise, slide to the right
      const slideDirection = goingToEdit && !comingFromEdit ? 'Left' : 'Right';
      classNames += slideDirection;
    } else {
      // Default case to handle the first render
      classNames += 'Left'; // or whichever you prefer as default
    }
    
    return (
      <TransitionGroup className="transition-group">
        <CSSTransition key={key} classNames={classNames} timeout={{ enter: 300, exit: 300 }}>
          <section className="route-section">
            <Routes location={location}>
              <Route path="/dashboard/:username/edit" element={<DashboardEditor />} />
              <Route path="/dashboard/:username" element={<Dashboard />} />
            </Routes>
          </section>
        </CSSTransition>
      </TransitionGroup>
    );
  }
    

  return (
    <Router>
      <AnimatedSwitch />
      <CustomizeButton />
      <SignupButton />
      <Routes>
        <Route path="/customize" element={<Customization title={title} setTitle={setTitle} />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* <Route path="/dashboard/:username" element={<Dashboard />} />
        <Route path="/dashboard/:username/edit" element={<DashboardEditor />} /> */}

        <Route path="/" element={
          <div className="app">
            <NavRow 
              title={title} 
              color="#B0BEC5" 
              onSelect={() => setSelectedSection(null)} 
              isShrinked={selectedSection !== null} 
            />
            {sections.map((section, index) => (
              <React.Fragment key={index}>
                <NavRow
                  title={section.title}
                  color={section.color}
                  onSelect={() => setSelectedSection(index)}
                  isShrinked={selectedSection !== null && selectedSection !== index}
                  isSelected={selectedSection === index}
                />
                <ContentArea 
                  section={section.title} 
                  color={section.color} 
                  isActive={selectedSection === index} 
                />
              </React.Fragment>
            ))}
          </div>
        } />
      </Routes>
    </Router>
  );
}


export default App;

