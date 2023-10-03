// src/DashboardEditor.js
import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard'; // Import Dashboard component
import axios from 'axios';
import DashboardLayoutSelector from './DashboardLayoutSelector'; // Import the new component

import { useParams, useNavigate } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import { useUser } from './UserContext';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import './App.scss';
import './DashboardEditor.scss';

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const bucketUrl = process.env.REACT_APP_GCP_BUCKET_URL;

// Custom Hook for debouncing
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

const useFetchDashboardData = (username) => {
  const [dashboard, setDashboard] = useState(null);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    axios.get(`${backendUrl}/${username}`)
      .then((response) => {
        setDashboard(response.data.dashboard);
        setSections(response.data.dashboard.sections);
      })
      .catch((error) => {
        console.error('An error occurred while fetching data:', error);
        alert("An error occurred. Please try again.");
      });
  }, [username]);

  return [dashboard, sections, setDashboard, setSections];
};

function DashboardEditor() {
  const { username } = useParams();
  const { user } = useUser();
  const { username: usernameFromURL } = useParams();
  const [dashboard, sections, setDashboard, setSections] = useFetchDashboardData(username);
  const [pickerIsOpen, setPickerIsOpen] = useState(null);
  const navigate = useNavigate();
  const [dashboardLayout, setDashboardLayout] = useState('accordion'); // Initialize with a default layout
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [animationParent] = useAutoAnimate();

  const [customDomain, setCustomDomain] = useState('');
  const [verificationToken, setVerificationToken] = useState('');
  const [isVerified, setIsVerified] = useState('false');
  
  const handleBackToDashboard = () => {
    navigate(`/${username}`);  // Replace this with the actual path to the user's dashboard
  }; 

  useEffect(() => {
    if (user === null) {
      navigate(`/${username}`);  // Navigate to the user's dashboard
    }
  }, [user,username,navigate]);

  // Redirect if the username from the URL does not match the logged-in user's username
  useEffect(() => {
    if (user && user.username !== usernameFromURL) {
      navigate(`/${username}`);
    }
  }, [user, usernameFromURL, navigate, username]);

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

  useEffect(() => {
    // Fetch verification details from the backend
    const fetchVerificationDetails = async () => {
      try {
        const response = await axios.get(`${backendUrl}/${username}/get-verification-details`);
        setVerificationToken(response.data.verificationToken);
        setCustomDomain(response.data.customDomain);
        setIsVerified(response.data.isVerified);  // No change needed here
      } catch (error) {
        console.error('Failed to fetch verification details:', error);
      }
    };
  
    fetchVerificationDetails();
  }, [username]);  

  const handleGenDomainVerification = async () => {
    // Generate a unique token for verification.
    const token = Math.random().toString(36).substr(2, 9);
    setVerificationToken(token);
  
    try {
      // Use the user object to send the user ID and verification token to your backend
      const response = await axios.post(`${backendUrl}/${username}/generate-verification-token`, {
        userId: user.id,  // Use 'id' to align with your UserContext field
        verificationToken: token,
        customDomain,  // Include customDomain here
      });
  
      if (response.data.success) {
        setIsVerified(false);  // Reset the verification status on the frontend
        // Maybe show a success message to the user that the token was generated
      } else {
        // Show an error message to the user
      }
    } catch (error) {
      console.error('Failed to generate verification token:', error);
      // Show an error message to the user
    }
  };

  const handleVerifyDNS = async () => {
    try {
      // Use the user object to send the user ID to your backend
      const response = await axios.post(`${backendUrl}/${username}/verify-dns`, {
        userId: user.id,  // Use 'id' to align with your UserContext field
      });
  
      if (response.data.success) {
        setIsVerified(true);  // Domain is verified
        // Maybe show a success message to the user
      } else {
        setIsVerified(false);  // Domain verification failed
        // Show an error message to the user
      }
    } catch (error) {
      setIsVerified(false);  // An error occurred, so consider it as a failed verification
      console.error('Failed to verify DNS:', error);
      // Show an error message to the user
    }
  };  

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

  const debouncedUpdateTitle = useDebounce((newTitle) => {
    axios.post(`${backendUrl}/${username}/update`, { title: newTitle })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, 300);

  const debouncedUpdateSections = useDebounce((newSections) => {
    axios.post(`${backendUrl}/${username}/sections`, { sections: newSections })
      .then(() => {
        // Database successfully updated
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
        <button className="back-button" onClick={handleBackToDashboard}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
        </button>
      </div>

      <div className="mini-dashboard-preview">
        <Dashboard sections={sections} layout={dashboardLayout} isPreview={true} />
      </div>

      <div className="editor-wrapper">

        <h1>Edit Dashboard for {username}</h1>

        <div className="layout-selector">
          <p>Select a layout for your dashboard:</p>
          <DashboardLayoutSelector currentLayout={dashboardLayout} onChange={handleLayoutChange} />
        </div>

        <div><label htmlFor="title">Title: </label>
          <input type="text" id="title" value={dashboard ? dashboard.title : ''} onChange={handleDashboardTitleChange} /></div>

        <div className="section-management">
          <h3>Add/Remove sections</h3>

          <div ref={animationParent} className="sections-list">

            {sections.map((section, index) => (
              <div className={`section-item`} key={index}>

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
                  <><button onClick={() => setPickerIsOpen(null)}>Close</button>
                    <ChromePicker
                      color={section.color}
                      onChangeComplete={(color) => handleColorChange(color, index)}
                    /></>
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

        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
        <p>Supported file types: jpg, png, gif</p>
        <button onClick={handleFileUpload}>Upload</button>

        <ul>
          {uploadedMedia.map((url, index) => (
            <li key={index}>
              <img src={url} alt="Uploaded Thumbnail" width="50" height="50" />
              <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
              <button onClick={() => handleDelete(url)}>Delete</button>
            </li>
          ))}
        </ul>

        <div>
          <input
            type="text"
            placeholder="Custom Domain"
            value={customDomain}
            onChange={e => setCustomDomain(e.target.value)}
          />
          <button onClick={handleGenDomainVerification}>Generate Verification Token</button>
        </div>

        {verificationToken && (
          <div>
            <p>Please add the following TXT record to your DNS settings to verify domain ownership:</p>
            <code>{verificationToken}</code>
            <button onClick={handleVerifyDNS}>Verify Domain</button>
          </div>
        )}

        {isVerified && <p>Domain verified!</p>}


      </div>

    </div>
  );
}

export default DashboardEditor;
