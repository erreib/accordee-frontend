import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from './UserContext';
import './App.css'

import AccordionLayout from './layouts/accordion/AccordionLayout';
import TabbedLayout from './layouts/tabbed/TabbedLayout';
import BasicLayout from './layouts/basic/BasicLayout'; // Don't forget to import BasicLayout

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function UserDashboard() {
  const { username } = useParams();
  const { user } = useUser();  // Get the current user from the context
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSection, setSelectedSection] = useState(null); // Define selectedSection state
  const [selectedTab, setSelectedTab] = useState(null); // Initialize selectedTab state

  const [layoutChoice, setDashboardLayout] = useState('basic');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the username parameter is valid before making the API request
    if (username) {
      // Create an array of API calls
      const apiCalls = [
        axios.get(`${backendUrl}/${username}`), // Fetch dashboard data
        axios.get(`${backendUrl}/${username}/layout`) // Fetch layout preference
      ];
  
      // Execute all API calls concurrently
      axios.all(apiCalls)
        .then(axios.spread((dashboardResponse, layoutResponse) => {
          setDashboard(dashboardResponse.data.dashboard);
          setDashboardLayout(layoutResponse.data.layout);
          setLoading(false);
          setError(null); // Clear any previous error
        }))
        .catch((err) => {
          console.error('API error:', err);
          if (err.response && err.response.status !== 404) {
            setError('User not found or other error');
          }
          setLoading(false);
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

          {layoutChoice === 'basic' && 
            <BasicLayout sections={dashboard.sections} />}

        </div>
      )}
    </div>
  );
}

export default UserDashboard;
