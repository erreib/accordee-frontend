// src/DashboardEditor.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Dashboard from '../../dashboard/Dashboard'; // Import Dashboard component
import DashboardLayoutSelector from './DashboardLayoutSelector'; // Import the new component
import DomainVerification from './DomainVerification';  // Import the new component

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

const backendUrl = process.env.REACT_APP_BACKEND_URL;

// Debounce timer to handle input changes on the user's dashboard settings
const useDebounce = (callback, delay) => {
  const [debounceTimer, setDebounceTimer] = useState(null);

  const debouncedFunction = (...args) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(() => {
      callback(...args);
    }, delay);

    setDebounceTimer(newTimer);
  };

  return debouncedFunction;
};

function DashboardEditor() {
  const { user } = useUser();
  const { username, username: dashboardUrl } = useParams();
  const [ setError ] = useState(null);

  const {
    dashboard, setDashboard,
    sections, setSections,
    dashboardLayout, setDashboardLayout,
    backgroundStyle, setBackgroundStyle,
    setUpdateTrigger
  } = useDashboard(); // Getting values from DashboardContext

  const [dashboardUserId, setDashboardUserId] = useState(null); // Or however you initialize it

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
    const fetchData = async () => {
      if (!dashboardUrl) {
        return;
      }
  
      try {
        const response = await axios.get(`${backendUrl}/${dashboardUrl}`);
        setDashboard(response.data.dashboard);
        setSections(response.data.dashboard.sections);
        // Set additional states as required
        setDashboardLayout(response.data.dashboard.layout);
        setBackgroundStyle(response.data.dashboard.backgroundStyle);
        // Include this line if you are managing dashboardUserId in the state
        setDashboardUserId(response.data.dashboard.dashboardUserId);
      } catch (err) {
        console.error("API error:", err);
        setError("An error occurred while fetching data");
      }
    };
  
    fetchData();
  }, [dashboardUrl, setDashboard, setSections, setDashboardLayout, setBackgroundStyle, setDashboardUserId, setError]); // Update the dependencies array as needed
  
  useEffect(() => {
    if (user === null) {
      navigate(`/${dashboardUrl}`);  // Navigate to the user's dashboard if not logged in
    }
  }, [user, username, navigate, dashboardUrl]);
  
  // Redirect if the username from the URL does not match the logged-in user's username
  useEffect(() => {
    if (user && dashboardUserId !== null) {
      console.log("User ID:", user.id, "Dashboard User ID:", dashboardUserId);
  
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

  const handleBackgroundChange = (e) => {
    const newBackgroundStyle = e.target.value;
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
  
  const debouncedUpdateSections = useDebounce((newSections) => {
    const token = localStorage.getItem('token'); // Retrieve the token

    axios.post(`${backendUrl}/${dashboardUrl}/sections`, { sections: newSections }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        // Database successfully updated
        setUpdateTrigger(prevTrigger => prevTrigger + 1);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, 300);

  const handleColorChange = (color, index) => {
    const newSections = [...sections];
    newSections[index].color = color.hex;
    setSections(newSections);

    const token = localStorage.getItem('token'); // Retrieve the token

    axios.post(`${backendUrl}/${dashboardUrl}/sections`, { sections: newSections }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        setUpdateTrigger(prevTrigger => prevTrigger + 1);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const togglePicker = (index) => {
    if (pickerIsOpen === index) {
      setPickerIsOpen(null);
    } else {
      setPickerIsOpen(index);
    }
  };

  const updateSectionInfoInDB = (index, newSectionTitle, newContent) => {
    // Step 1: Update local state immediately
    const newSections = [...sections];

    // Update the title and content if they are not undefined
    if (newSectionTitle !== undefined) {
      newSections[index].title = newSectionTitle;
    }
    if (newContent !== undefined) {
      newSections[index].content = newContent;
    }

    setSections(newSections);

    debouncedUpdateSections(newSections);  // Using debounced function here
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (destination.index === source.index) {
      return;
    }

    moveSection(source.index, destination.index);
  };

  const moveSection = (fromIndex, toIndex) => {
    const newSections = [...sections];
    const [movedItem] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, movedItem);

    // Update the "order" field for each section
    newSections.forEach((section, index) => {
      section.order = index;
    });

    // Update the sections first
    setSections(newSections);

    // Then update the backend
    axios.post(`${backendUrl}/${dashboardUrl}/sections`, { sections: newSections }, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(() => {
        // Once the backend is updated, then update the trigger
        setUpdateTrigger(prevTrigger => prevTrigger + 1);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const addSection = () => {
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
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const removeSection = (index) => {
    const newSections = sections.filter((_, i) => i !== index);

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
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div id="main-container" className="editor-container">

      <Helmet>
      <title>
            {dashboard
              ? `${dashboard.title} | Edit | Accordee Dashboard`
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
          sections={sections}
          layout={dashboardLayout}
          isPreview={true}
          backgroundStyle={backgroundStyle}
        />
      </div>

      <div className="editor-wrapper">

        <h1>Edit Dashboard for {username}</h1>

        <div><label htmlFor="title">Title: </label>
          <input type="text" id="title" value={dashboard ? dashboard.title : ''} onChange={handleDashboardTitleChange} />
        </div>

        <div className="tabs">
          <button className={activeTab === 'sections' ? 'active-tab' : ''} onClick={() => handleTabChange('sections')}>
            Sections
          </button>
          <button className={activeTab === 'look and feel' ? 'active-tab' : ''} onClick={() => handleTabChange('look and feel')}>
            Look and Feel
          </button>
          <button className={activeTab === 'beta features' ? 'active-tab' : ''} onClick={() => handleTabChange('beta features')}>
            Beta Features
          </button>
        </div>

        {activeTab === 'sections' && (
          <div className="section-management">
            <h3>Add/Remove sections</h3>

            <button className="button" onClick={addSection}>+</button>

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
                                  onClick={() => moveSection(index, index - 1)}
                                >
                                  <FontAwesomeIcon icon={faArrowUp} />
                                </button>

                                <button
                                  className={`arrow-button ${index === sections.length - 1 ? 'disabled-arrow' : ''}`}
                                  disabled={index === sections.length - 1}
                                  onClick={() => moveSection(index, index + 1)}
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
                              onClick={() => togglePicker(index)}
                            >
                              {pickerIsOpen === index ? '▼' : '▶'}
                            </button>
                            {pickerIsOpen === index && (
                              <>
                                <button onClick={() => setPickerIsOpen(null)}>Close</button>
                                <ChromePicker
                                  color={section.color}
                                  onChangeComplete={(color) => handleColorChange(color, index)}
                                />
                              </>
                            )}

                            <input
                              type="text"
                              placeholder="Enter section title..."
                              value={section.title || ''}
                              onChange={(e) => updateSectionInfoInDB(index, e.target.value, undefined)}
                            />

                            <input
                              type="text"
                              placeholder="Enter custom content..."
                              value={section.content || ''}
                              onChange={(e) => updateSectionInfoInDB(index, undefined, e.target.value)}
                            />

                            <div className="button-container">
                              <button className="remove-button" onClick={() => removeSection(index)}>
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
          <div>
            <div className="layout-selector">
              <p>Select a layout for your dashboard:</p>
              <DashboardLayoutSelector currentLayout={dashboardLayout} onChange={handleLayoutChange} />
            </div>

            <div>
              <label>Background Style: </label>
              <select value={backgroundStyle} onChange={handleBackgroundChange}>
                <option value="style1">Style 1</option>
                <option value="style2">Style 2</option>
                <option value="style3">Style 3</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'beta features' && (
          <div>
            <div className="beta-features-section">
              <h2>Beta Features</h2>

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
