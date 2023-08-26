// src/DashboardEditor.js
import React, { useEffect, useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChromePicker } from 'react-color';
import { CSSTransition } from 'react-transition-group';
import './App.css'

function DashboardEditor() {
  const { username } = useParams();
  const [dashboard, setDashboard] = useState(null);
  const [sections, setSections] = useState([]);
  const [pickerIsOpen, setPickerIsOpen] = useState(null);
  const [isEditing, setIsEditing] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate(`/dashboard/${username}`);  // Replace this with the actual path to the user's dashboard
  };
  
  useEffect(() => {
    axios.get(`http://localhost:5000/dashboard/${username}`)
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
    axios.post(`http://localhost:5000/dashboard/${username}/update`, { title: newTitle })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  // Functions and logic from Customization.js

  const updateSectionTitleInDB = (index, newTitle) => {
    const newSections = [...sections];
    newSections[index].title = newTitle;
    axios.post(`http://localhost:5000/dashboard/${username}/sections`, { sections: newSections })
      .then(() => {
        setSections(newSections);
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
    setSections(newSections);
    axios.post(`http://localhost:5000/dashboard/${username}/sections`, { sections: newSections });
  };

  const removeSection = (index) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
    axios.post(`http://localhost:5000/dashboard/${username}/sections`, { sections: newSections });
  };

  const handleColorChange = (color, index) => {
    const newSections = [...sections];
    newSections[index].color = color.hex;
    setSections(newSections);
    axios.post(`http://localhost:5000/dashboard/${username}/sections`, { sections: newSections });
  };

  const togglePicker = (index) => {
    if (pickerIsOpen === index) {
      setPickerIsOpen(null);
    } else {
      setPickerIsOpen(index);
    }
  };

  return (
    <CSSTransition in={true} timeout={300} classNames="transition">
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
                <button onClick={() => removeSection(index)}>-</button>
            </div>
            ))}
            <button onClick={addSection}>+</button>
        </div>
    </div>
    </CSSTransition>
  );
}

export default DashboardEditor;
