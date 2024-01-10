// src/DashboardEditor.js
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

import Dashboard from '../Dashboard'; // Import Dashboard component
import DashboardLayoutSelector from './selectors/DashboardLayoutSelector'; // Import the new component
import BackgroundStyleSelector from './selectors/BackgroundStyleSelector';
import DomainVerification from './DomainVerification';  // Import the new component

import { debouncedUpdateSections, handleColorChange, useDebounce,
  updateSectionInfoInDB, moveSection, removeSection } from './SectionsFunctions'; // Adjust the path as necessary

import FileUploader from '../../components/FileUploader';

import { useDashboard } from '../DashboardContext';
import { useParams, useNavigate } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import { useUser } from '../../auth/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faArrowLeft, faTimes } from '@fortawesome/free-solid-svg-icons';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Helmet } from 'react-helmet-async';

import '../../App.scss';
import './DashboardEditor.scss';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const bucketUrl = import.meta.env.VITE_GCP_BUCKET_URL;


function DashboardEditor() {
  const { user } = useUser();
  const { username, dashboardUrl } = useParams();
  const [setError] = useState(null);

  const {
    dashboard, setDashboard,
    sections, setSections,
    dashboardLayout, setDashboardLayout,
    backgroundStyle, setBackgroundStyle,
    dashboardUserId, setDashboardUserId,
    fetchData, // Added fetchData from context
    setUpdateTrigger
  } = useDashboard();

  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [showFileUploader, setShowFileUploader] = useState(false); // State to control visibility

  const handleThumbnailSelection = (url) => {
    setThumbnailUrl(url);
    updateDashboardThumbnail(url);
  };

  const updateDashboardThumbnail = (url) => {
    const token = localStorage.getItem('token'); // Assuming the token is stored in local storage

    axios.post(`${backendUrl}/${dashboardUrl}/thumbnail`, 
      { thumbnailUrl: url },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(response => {
      setUpdateTrigger(prevTrigger => prevTrigger + 1);
      // Handle successful thumbnail update
      console.log('Thumbnail updated successfully', response.data);
    })
    .catch(error => {
      // Handle errors
      console.error('Error updating thumbnail', error);
    });
  };

  useEffect(() => {
    // Fetch dashboard details
    axios.get(`${backendUrl}/${dashboardUrl}`)
      .then(response => {
        // Assuming the response contains a field 'thumbnailUrl'
        const currentThumbnail = response.data.dashboard.thumbnailUrl;
        if (currentThumbnail) {
          setThumbnailUrl(currentThumbnail);
        }
      })
      .catch(error => {
        console.error('Error fetching dashboard details:', error);
      });
  }, [dashboardUrl, backendUrl]); // Add dependencies if needed

  useEffect(() => {
    // Using fetchData from DashboardContext
    fetchData(dashboardUrl, backendUrl).catch(err => {
      console.error("API error:", err);
      setError("An error occurred while fetching data"); // Handling error
    });
  }, [dashboardUrl, setDashboard, 
      setSections, setDashboardLayout, 
      setBackgroundStyle, setDashboardUserId, 
      setError]); // Update the dependencies array as needed

  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('activeTab');
    return savedTab || 'sections';
  });

  const [pickerIsOpen, setPickerIsOpen] = useState(null);
  const navigate = useNavigate();

  const axiosConfig = {
    headers: {}
  };

  if (user && user.token) {
    axiosConfig.headers['Authorization'] = `Bearer ${user.token}`;
  }

  const handleBackToDashboard = () => {
    navigate(`/${dashboardUrl}`);  // Replace this with the actual path to the user's dashboard
  };

  useEffect(() => {
    if (user === null) {
      navigate(`/${dashboardUrl}`);  // Navigate to the user's dashboard if not logged in
    }
  }, [user, username, navigate, dashboardUrl]);

  // Redirect if the username from the URL does not match the logged-in user's username
  useEffect(() => {
    if (user && dashboardUserId !== null) {
      // Convert both to numbers and then compare
      if (Number(user.id) !== Number(dashboardUserId)) {
        console.log("Redirecting because user IDs don't match.");
        navigate(`/${dashboardUrl}`);
      } else {
        console.log("No redirection - user IDs match.");
      }
    } else {
      console.log("Waiting for user and dashboardUserId to be set.");
    }
  }, [user, dashboardUserId, navigate, dashboardUrl]);

  // Function to switch tabs
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    // Save the current tab to localStorage
    localStorage.setItem('activeTab', tabName);
  };

  const handleLayoutChange = (newLayout) => {
    const token = localStorage.getItem('token'); // Assuming the token is stored in local storage

    axios.post(`${backendUrl}/${dashboardUrl}/layout`, { layout: newLayout }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        setDashboardLayout(newLayout);
      })
      .catch((error) => {
        console.error('Error updating layout:', error);
      });
  };

  const handleBackgroundChange = (newBackgroundStyle) => {
    setBackgroundStyle(newBackgroundStyle);
  
    // Retrieve the token from local storage
    const token = localStorage.getItem('token');
  
    // Call API to update background style in backend
    axios.post(`${backendUrl}/${dashboardUrl}/background-style`, { backgroundStyle: newBackgroundStyle }, {
      headers: {
        'Authorization': `Bearer ${token}` // Include the token in the request header
      }
    })
      .then(() => {
        // You can update the state or UI here if needed
      })
      .catch((error) => {
        console.error('Error updating background style:', error);
      });
  };
  
  const debouncedUpdateTitle = useDebounce((newTitle) => {
    const token = localStorage.getItem('token'); // Retrieve the token

    axios.post(`${backendUrl}/${dashboardUrl}/title`, { title: newTitle }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, 300);

  const handleDashboardTitleChange = (event) => {
    const newDashboardTitle = event.target.value;
    if (dashboard) {
      setDashboard({ ...dashboard, title: newDashboardTitle });
      debouncedUpdateTitle(newDashboardTitle);  // Using debounced function here
    }
  };

  //Start functions related to section management

  function updateSections(newSections) {
    debouncedUpdateSections(newSections, setUpdateTrigger, backendUrl, dashboardUrl);
  }

  const debouncedUpdate = useDebounce(updateSections, 300);

  function onColorChange(color, index) {
    handleColorChange(color, index, sections, setSections, setUpdateTrigger, backendUrl, dashboardUrl);
  }

  const handleSectionsChange = (newSections) => {
    debouncedUpdate(newSections);
  };

  const updateSectionInfo = (index, newTitle, newContent) => {
    updateSectionInfoInDB(index, newTitle, newContent, sections, setSections, handleSectionsChange);
  };

  const handleMoveSection = (fromIndex, toIndex) => {
    moveSection(fromIndex, toIndex, sections, setSections, setUpdateTrigger, backendUrl, dashboardUrl);
  };

  const handleRemoveSection = (index) => {
    removeSection(index, sections, setSections, setUpdateTrigger, backendUrl, dashboardUrl);
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (destination.index === source.index) {
      return;
    }

    handleMoveSection(source.index, destination.index);
  };

  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const MAX_SECTIONS_PER_DASHBOARD = 10; // Set your desired limit (should match the backend limit)
  const COOLDOWN_PERIOD = 1000; // Cooldown period in milliseconds (e.g., 5000ms = 5 seconds)
  const cooldownFlag = useRef(true); // Initialize the cooldown flag
  
  const addSection = () => {
    if (!cooldownFlag.current) {
      // Do nothing if cooldown is active
      return;
    }
  
    if (sections.length >= MAX_SECTIONS_PER_DASHBOARD) {
      alert(`You can only add up to ${MAX_SECTIONS_PER_DASHBOARD} sections per dashboard.`);
      return; // Stop the function if the limit is reached
    }
  
    // Disable further additions until the cooldown is over
    cooldownFlag.current = false;
  
    const newSection = {
      title: `Section ${sections.length + 1}`,
      color: '#FFFFFF',
    };
    const newSections = [...sections, newSection];
  
    // Update the sections first
    setSections(newSections);
  
    const token = localStorage.getItem('token'); // Retrieve the token
  
    // Then update the backend
    axios.post(`${backendUrl}/${dashboardUrl}/sections`, { sections: newSections }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        // Once the backend is updated, then update the trigger
        setUpdateTrigger(prevTrigger => prevTrigger + 1);
        // Start cooldown
        setIsCooldownActive(true);
        setTimeout(() => {
          setIsCooldownActive(false);
          cooldownFlag.current = true; // Reset the flag after cooldown
        }, COOLDOWN_PERIOD);
      })
      .catch((error) => {
        console.error('Error:', error);
        setIsCooldownActive(false);
        cooldownFlag.current = true; // Reset the flag in case of an error
      });
  };
  
  // Normal and cooldown styles for the add button
  const addButtonStyles = {
    normal: {
      // your normal button styles
    },
    cooldown: {
      opacity: 0.5,
      cursor: 'not-allowed'
      // any other styles for the cooldown state
    }
  };

  //End sections management

  const toggleFileUploader = () => {
    setShowFileUploader(!showFileUploader); // Toggle visibility
  };

  const toggleColorPicker = (index) => {
    if (pickerIsOpen === index) {
      setPickerIsOpen(null);
    } else {
      setPickerIsOpen(index);
    }
  };

  return (
    <div id="outer-editscreen-container" className="outer-editscreen-container">

      <Helmet>
        <title>
          {dashboard
            ? `${dashboardUrl} | Edit | Accordee Dashboard`
            : "Loading Dashboard..."}
        </title>
      </Helmet>

      <div className="floating-button-container">
        <button className="back-button" onClick={handleBackToDashboard}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
        </button>
      </div>

      <div className={`mini-dashboard-preview`}>
        <Dashboard
          isPreview={true}
        />
      </div>

      <div className="editor-wrapper">

        <h1>Editing dashboard: {dashboardUrl}</h1>

        <div className="tabs">
          <button className={activeTab === 'sections' ? 'active-tab' : ''} onClick={() => handleTabChange('sections')}>
            Sections
          </button>
          <button className={activeTab === 'look and feel' ? 'active-tab' : ''} onClick={() => handleTabChange('look and feel')}>
            Look and Feel
          </button>
          <button className={activeTab === 'link options' ? 'active-tab' : ''} onClick={() => handleTabChange('link options')}>
            Link Options (BETA)
          </button>
        </div>

        {activeTab === 'sections' && (
          <div className="section-management">
            <h3>Add/Remove sections</h3>

            <button
              className="button"
              style={isCooldownActive ? addButtonStyles.cooldown : addButtonStyles.normal}
              onClick={addSection}
              disabled={isCooldownActive}
            >
              +
            </button>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="sections-list">
                    {sections.map((section, index) => (
                      <Draggable key={index} draggableId={String(index)} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="section-item"
                          >
                            <div className="button-container">
                              <div className="arrow-buttons">
                                <button
                                  className={`arrow-button ${index === 0 ? 'disabled-arrow' : ''}`}
                                  disabled={index === 0}
                                  onClick={() => handleMoveSection(index, index - 1)}
                                >
                                  <FontAwesomeIcon icon={faArrowUp} />
                                </button>

                                <button
                                  className={`arrow-button ${index === sections.length - 1 ? 'disabled-arrow' : ''}`}
                                  disabled={index === sections.length - 1}
                                  onClick={() => handleMoveSection(index, index + 1)}
                                >
                                  <FontAwesomeIcon icon={faArrowDown} />
                                </button>
                              </div>
                            </div>
                            <button
                              style={{
                                backgroundColor: section.color,
                                width: '20px',
                                height: '20px',
                              }}
                              onClick={() => toggleColorPicker(index)}
                            >
                            {pickerIsOpen === index ? '▼' : '▶'}
                            </button>
                            {pickerIsOpen === index && (
                              <>
                                <button onClick={() => setPickerIsOpen(null)}>Close</button>
                                <ChromePicker
                                  color={section.color}
                                  onChangeComplete={(color) => onColorChange(color, index)}
                                />
                              </>
                            )}

                            <input
                              type="text"
                              placeholder="Enter section title..."
                              value={section.title || ''}
                              onChange={(e) => updateSectionInfo(index, e.target.value, undefined)}
                            />

                            <input
                              type="text"
                              placeholder="Enter custom content..."
                              value={section.content || ''}
                              onChange={(e) => updateSectionInfo(index, undefined, e.target.value)}
                            />

                            <div className="button-container">
                              <button className="remove-button" onClick={() => handleRemoveSection(index)}>
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </div>

                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

          </div>
        )}

        {activeTab === 'look and feel' && (
          <div className="look-and-feel-tab">

            <div>
              
              <div class="dashboard-thumbnail-section">
                <label>Dashboard thumbnail:</label>

                {thumbnailUrl && (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img src={thumbnailUrl} alt="Dashboard Thumbnail" style={{ width: '100px', height: '100px' }} />
                  <button onClick={() => handleThumbnailSelection(null)} style={{ position: 'absolute', top: 0, right: 0 }}>
                    X {/* Replace with an icon or style as needed */}
                  </button>
                </div>
                )}

                <button onClick={toggleFileUploader}>
                  {showFileUploader ? 'Hide Upload Section ▼' : 'Show Upload Section ►'}
                </button>
              </div>

              {showFileUploader && (
                  <FileUploader
                    enableThumbnailSelection={true} 
                    username={user.username}
                    backendUrl={backendUrl}
                    bucketUrl={bucketUrl}
                    onSelectThumbnail={handleThumbnailSelection} 
                  />
              )}
        
              <div><label htmlFor="title">Display title: </label>
                <input type="text" id="title" value={dashboard ? dashboard.title : ''} onChange={handleDashboardTitleChange} />
              </div>

              <div className="layout-selector">
                <DashboardLayoutSelector currentLayout={dashboardLayout} onChange={handleLayoutChange} />
              </div>

              <BackgroundStyleSelector currentStyle={backgroundStyle} onChange={handleBackgroundChange} />
            
            </div>

          </div>
        )}

        {activeTab === 'link options' && (
          <div>
            <div className="link-options-section">
              <h2>Link options (BETA)</h2>

              <hr className="section-divider" />

              <div className="domain-verification-section">
                <h3>Domain Verification</h3>
                <DomainVerification
                  dashboardUrl={dashboardUrl}
                  backendUrl={backendUrl}
                  userId={user ? user.id : null}
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default DashboardEditor;
