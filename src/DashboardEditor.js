// src/DashboardEditor.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChromePicker } from 'react-color';
import { useUser } from './UserContext';
import './App.css'

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function DashboardEditor() {
  const { username } = useParams();
  const [dashboard, setDashboard] = useState(null);
  const [sections, setSections] = useState([]);
  const [pickerIsOpen, setPickerIsOpen] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const { user } = useUser();
  const navigate = useNavigate();
  const { username: usernameFromURL } = useParams();
  const [debounceTimer, setDebounceTimer] = useState(null);
  
  const handleBackToDashboard = () => {
    navigate(`/${username}`);  // Replace this with the actual path to the user's dashboard
  };

// Redirect if the username from the URL does not match the logged-in user's username
  useEffect(() => {
    if (user && user.username !== usernameFromURL) {
      navigate(`/${username}`);
    }
  }, [user, usernameFromURL, navigate]);
  
  useEffect(() => {
    axios.get(`${backendUrl}/${username}`)
      .then((response) => {
        setDashboard(response.data.dashboard);
        setSections(response.data.dashboard.sections);
      })
      .catch((error) => {
        console.error('An error occurred while fetching data:', error);
      });
  }, [username]);

  const handleTitleChange = (event) => {
    const newTitle = event.target.value;
    if (dashboard) {
      setDashboard({ ...dashboard, title: newTitle });
      updateTitleInDB(newTitle);
    }
  };

  const updateTitleInDB = (newTitle) => {
    axios.post(`${backendUrl}/${username}/update`, { title: newTitle })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const updateSectionTitleInDB = (index, newTitle) => {
    const newSections = [...sections];
    newSections[index].title = newTitle;
    axios.post(`${backendUrl}/${username}/sections`, { sections: newSections })
      .then(() => {
        setSections(newSections);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const updateSectionContentInDB = (index, newContent) => {
    // Step 1: Update local state immediately
    const newSections = [...sections];
    newSections[index].content = newContent;
    setSections(newSections);
  
    // Step 2: Update the database, but debounce this to reduce the load on your server
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  
    const newTimer = setTimeout(() => {
      axios.post(`${backendUrl}/${username}/sections`, { sections: newSections })
        .then(() => {
          // Database successfully updated
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }, 300);  // 300 milliseconds delay
  
    setDebounceTimer(newTimer);
  };
    

  const addSection = () => {
    const newSection = {
      title: `Section ${sections.length + 1}`,
      color: '#FFFFFF',
    };
    const newSections = [...sections, newSection];
    setSections(newSections);
    axios.post(`${backendUrl}/${username}/sections`, { sections: newSections });
  };

  const removeSection = (index) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
    axios.post(`${backendUrl}/${username}/sections`, { sections: newSections });
  };

  const handleColorChange = (color, index) => {
    const newSections = [...sections];
    newSections[index].color = color.hex;
    setSections(newSections);
    axios.post(`${backendUrl}/${username}/sections`, { sections: newSections });
  };

  const togglePicker = (index) => {
    if (pickerIsOpen === index) {
      setPickerIsOpen(null);
    } else {
      setPickerIsOpen(index);
    }
  };

  const moveSection = (fromIndex, toIndex) => {
    const newSections = [...sections];
    const [movedItem] = newSections.splice(fromIndex, 1);
    newSections.splice(toIndex, 0, movedItem);
  
    // Update the "order" field for each section
    newSections.forEach((section, index) => {
      section.order = index;
    });
  
    setSections(newSections);
  
    // Send updated ordering to the server (including the new "order" fields)
    axios.post(`${backendUrl}/${username}/sections`, { sections: newSections })
      .then((res) => {
        // Handle success
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
      
  return (
    <div id="main-container" className="dashboard-editor-container">

        <div className="floating-button-container">
            <button onClick={handleBackToDashboard}>Back to Dashboard</button>
        </div>

        <h1>Edit Dashboard for {username}</h1>
        <label htmlFor="title">Title: </label>
        <input type="text" id="title" value={dashboard ? dashboard.title : ''} onChange={handleTitleChange} />
        <div className="sections-customization">
            <h3>Add/Remove sections</h3>
            
            {sections.map((section, index) => (
            <div key={index}>

                {isEditing === index ? (
                <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                />
                ) : (
                    <span>{section.title}</span>
                )}
            {isEditing === index ? (
                <button
                onClick={() => {
                    // Call function to update title in DB here
                    // setSections to update the section title
                    updateSectionTitleInDB(index, newTitle);
                    setIsEditing(null);
                }}
                >
                Save
                </button>
            ) : (
                <button
                onClick={() => {
                    setNewTitle(section.title); // set current title to temp state
                    setIsEditing(index); // set to editing mode
                }}
                >
                Edit
                </button>
            )}
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
                <ChromePicker
                    color={section.color}
                    onChangeComplete={(color) => handleColorChange(color, index)}
                />
                )}

                <input 
                  type="text" 
                  placeholder="Enter custom content..." 
                  value={section.content || ''}
                  onChange={(e) => updateSectionContentInDB(index, e.target.value)}
                />

                <button onClick={() => removeSection(index)}>-</button>
                
                <button disabled={index === 0} onClick={() => moveSection(index, index - 1)}>Up</button>
                <button disabled={index === sections.length - 1} onClick={() => moveSection(index, index + 1)}>Down</button>


            </div>
            ))}
            <button onClick={addSection}>+</button>
        </div>
    </div>
  );
}

export default DashboardEditor;
