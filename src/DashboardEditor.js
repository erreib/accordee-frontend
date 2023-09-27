// src/DashboardEditor.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChromePicker } from 'react-color';
import { useUser } from './UserContext';
import DashboardLayoutSelector from './DashboardLayoutSelector'; // Import the new component
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

import './App.css';
import './DashboardEditor.css';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const bucketUrl = process.env.REACT_APP_GCP_BUCKET_URL;

function DashboardEditor() {
  const { username } = useParams();
  const [dashboard, setDashboard] = useState(null);
  const [sections, setSections] = useState([]);
  const [pickerIsOpen, setPickerIsOpen] = useState(null);
  const { user } = useUser();
  const navigate = useNavigate();
  const { username: usernameFromURL } = useParams();
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [dashboardLayout, setDashboardLayout] = useState('accordion'); // Initialize with a default layout
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [animationParent] = useAutoAnimate();
  
  const handleBackToDashboard = () => {
    navigate(`/${username}`);  // Replace this with the actual path to the user's dashboard
  };

// Redirect if the username from the URL does not match the logged-in user's username
  useEffect(() => {
    if (user && user.username !== usernameFromURL) {
        navigate(`/${username}`);
    }
  }, [user, usernameFromURL, navigate, username]);

  
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

  useEffect(() => {
    // Fetch the user's dashboard layout choice from the backend
    axios.get(`${backendUrl}/${username}/layout`)
      .then((response) => {
        setDashboardLayout(response.data.layout);
      })
      .catch((error) => {
        console.error('An error occurred while fetching layout data:', error);
      });
  }, [username]);

  useEffect(() => {
    // Fetch the user's uploadedMedia array from the backend
    axios.get(`${backendUrl}/${username}/uploaded-media`)
      .then((response) => {
        setUploadedMedia(response.data.uploadedMedia || []);
      })
      .catch((error) => {
        console.error('An error occurred while fetching uploaded media:', error);
      });
  }, [username]);  // The effect will re-run if the username changes

  // New handleDelete function
  const handleDelete = (url) => {
    // Make an API call to delete the file
    axios.delete(`${backendUrl}/${username}/delete-media`, { data: { url } })
      .then((response) => {
        // Remove the URL from the uploadedMedia state array
        const newUploadedMedia = uploadedMedia.filter(item => item !== url);
        setUploadedMedia(newUploadedMedia);
      })
      .catch((error) => {
        console.error('An error occurred while deleting the file:', error);
      });
  };

  const handleLayoutChange = (newLayout) => {
    // Update the user's dashboard layout choice in the backend
    axios.post(`${backendUrl}/${username}/layout`, { layout: newLayout })
      .then(() => {
        setDashboardLayout(newLayout);
      })
      .catch((error) => {
        console.error('Error updating layout:', error);
      });
  };

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

  const updateSectionInfoInDB = (index, newTitle, newContent) => {
    // Step 1: Update local state immediately
    const newSections = [...sections];
  
    // Update the title and content if they are not undefined
    if (newTitle !== undefined) {
      newSections[index].title = newTitle;
    }
    if (newContent !== undefined) {
      newSections[index].content = newContent;
    }
  
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

  const handleFileUpload = async () => {
    // Create a FormData object and append the file
    const formData = new FormData();
    formData.append('media', selectedFile);
  
    // Make the API call to upload the file
    try {
      await axios.post(`${backendUrl}/${username}/upload-media`, formData);
      
      // After successful upload, construct the new media URL
      const newMediaUrl = `${bucketUrl}/${username}/${selectedFile.name}`;
  
      // Update the uploadedMedia state, but only if the URL is not a duplicate
      setUploadedMedia(prevState => {
        if (!prevState.includes(newMediaUrl)) {
          return [...prevState, newMediaUrl];
        }
        return prevState;
      });
  
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };  

  return (
    <div id="main-container" className="editor-container">

        <div className="floating-button-container">
            <button onClick={handleBackToDashboard}>Back to Dashboard</button>
        </div>

        <h1>Edit Dashboard for {username}</h1>
        
        <div className="layout-selector">
          <DashboardLayoutSelector currentLayout={dashboardLayout} onChange={handleLayoutChange} />
        </div>

        <div><label htmlFor="title">Title: </label>
        <input type="text" id="title" value={dashboard ? dashboard.title : ''} onChange={handleTitleChange} /></div>

        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
        <button onClick={handleFileUpload}>Upload</button>
        
        <ul>
          {uploadedMedia.map((url, index) => (
            <li key={index}>
              <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
              <button onClick={() => handleDelete(url)}>Delete</button>
            </li>
          ))}
        </ul>

        <h3>Add/Remove sections</h3>

        <div ref={animationParent} className="sections-list">
            
            {sections.map((section, index) => (
              <div className={`section-item`} key={index}>

                <input 
                  type="text" 
                  placeholder="Enter section title..." 
                  value={section.title || ''} 
                  onChange={(e) => updateSectionInfoInDB(index, e.target.value, undefined)}
                />

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
                  onChange={(e) => updateSectionInfoInDB(index, undefined, e.target.value)}
                />

                <button onClick={() => removeSection(index)}>-</button>
                
                <button 
                  className={`row-button ${index === 0 ? 'disabled-arrow' : ''}`} 
                  disabled={index === 0} 
                  onClick={() => moveSection(index, index - 1)}
                >
                  <FontAwesomeIcon icon={faArrowUp} />
                </button>
                <button 
                  className={`row-button ${index === sections.length - 1 ? 'disabled-arrow' : ''}`} 
                  disabled={index === sections.length - 1} 
                  onClick={() => moveSection(index, index + 1)}
                >
                  <FontAwesomeIcon icon={faArrowDown} />
                </button>

            </div>
            ))}

            <button className="button" onClick={addSection}>+</button>
        </div>
    </div>
  );
}

export default DashboardEditor;
