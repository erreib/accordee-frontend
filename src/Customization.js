// src/Customization.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChromePicker } from 'react-color'; // Import color picker
import './App.css'

function Customization({ title, setTitle, setShouldRefresh }) {

  const handleTitleChange = (event) => {
    const newTitle = event.target.value;
    setTitle(newTitle);
    updateTitleInDB(newTitle);
  };

  const updateTitleInDB = (newTitle) => {
    fetch('http://localhost:5000/title', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTitle }),
    })
      .then((response) => response.json())
      .catch((error) => console.error('Error:', error));
  };

  const [sections, setSections] = React.useState([]); 
  const [pickerIsOpen, setPickerIsOpen] = useState(null);
  const [isEditing, setIsEditing] = useState(null); // null when not editing, index when editing
  const [newTitle, setNewTitle] = useState(''); // Temporary state to hold new title value

  const updateSectionTitleInDB = (index, newTitle) => {
    const newSections = [...sections];
    newSections[index].title = newTitle;
    // Update database after updating a section title
    axios.post('http://localhost:5000/sections', { sections: newSections })
      .then(() => {
        setSections(newSections);  // Update local state
      })
      .catch((error) => console.error('Error:', error));
  };


  // Fetch initial sections from the server
  const fetchSections = async () => {
    try {
      const response = await axios.get('http://localhost:5000/sections');
      setSections(response.data.sections);
    } catch (err) {
      console.error('An error occurred while fetching data:', err);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);
  
  const addSection = () => {
    const newSection = {
      title: `Section ${sections.length + 1}`,
      color: '#FFFFFF',
    };
    const newSections = [...sections, newSection];
    setSections(newSections);
    
    // Save new section to the database
    axios.post('http://localhost:5000/sections', { sections: newSections });
  };

  const removeSection = (index) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
    
    // Update database after removing a section
    axios.post('http://localhost:5000/sections', { sections: newSections });
  };

  // Handle color change
  const handleColorChange = (color, index) => {
    const newSections = [...sections];
    newSections[index].color = color.hex;
    setSections(newSections);
    axios.post('http://localhost:5000/sections', { sections: newSections });
  };  

  const togglePicker = (index) => {
    if (pickerIsOpen === index) {
      setPickerIsOpen(null);
    } else {
      setPickerIsOpen(index);
    }
  };


  return (
    <div className="customization-container">
      
      <label htmlFor="title">Title: </label>
      <input type="text" id="title" value={title} onChange={handleTitleChange} />
      
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
  );
};

export default Customization;
