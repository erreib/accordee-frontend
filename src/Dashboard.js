import React, { useEffect, useState } from 'react';
import AccordionLayout from './layouts/accordion/AccordionLayout';
import TabbedLayout from './layouts/tabbed/TabbedLayout';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from './UserContext';
import './App.css'

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function UserDashboard() {
  const { username } = useParams();
  const { user } = useUser();  // Get the current user from the context
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSection, setSelectedSection] = useState(null); // Define selectedSection state
  const [selectedTab, setSelectedTab] = useState(null); // Initialize selectedTab state

  const [layoutChoice, setDashboardLayout] = useState('accordion');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the username parameter is valid before making the API request
    if (username) {
      // Fetch dashboard data
      axios.get(`${backendUrl}/${username}`)
        .then((response) => {
          setDashboard(response.data.dashboard);
          setLoading(false);
          setError(null); // Clear any previous error
        })
        .catch((err) => {
          console.error('API error:', err);
          if (err.response && err.response.status !== 404) {
            setError('User not found or other error');
          }
          setLoading(false);
        });
  
      // Fetch layout preference
      axios.get(`${backendUrl}/${username}/layout`)
        .then((response) => {
          setDashboardLayout(response.data.layout);
        })
        .catch((err) => {
          console.error('API error:', err);
          // Handle errors related to fetching layout preference here if needed
        });
    } else {
      setLoading(false); // No need to load anything if username is not available
    }
  }, [username]);
  
  const handleEdit = () => {
    navigate(`/${username}/edit`);
  };  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div id="main-container" className="user-dashboard-container">

      {user && user.username === username && (
        <div className="floating-button-container">
          <span>User Dashboard for {username}</span>
          <button onClick={handleEdit}>Edit</button>
        </div>
      )}
      
      {error && <div>{error}</div>}

      {!error && dashboard && (
        <div>

          {layoutChoice === 'accordion' && (
            <AccordionLayout dashboard={dashboard} selectedSection={selectedSection} setSelectedSection={setSelectedSection} />
          )}

          {layoutChoice === 'tabbed' && (
            <TabbedLayout dashboard={dashboard} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
          )}

        </div>
      )}
    </div>
  );
}

export default UserDashboard;
