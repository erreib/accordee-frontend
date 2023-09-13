import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from './UserContext';
import './App.css'

import AccordionLayout from './layouts/accordion/AccordionLayout';
import TabbedLayout from './layouts/tabbed/TabbedLayout';
import BasicLayout from './layouts/basic/BasicLayout';
import SkeletonLoader from './SkeletonLoader';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function UserDashboard() {
  const { username } = useParams();
  const { user } = useUser();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);

  const [layoutChoice, setDashboardLayout] = useState('basic');
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      const apiCalls = [
        axios.get(`${backendUrl}/${username}`),
        axios.get(`${backendUrl}/${username}/layout`)
      ];
  
      axios.all(apiCalls)
        .then(axios.spread((dashboardResponse, layoutResponse) => {
          setDashboard(dashboardResponse.data.dashboard);
          setDashboardLayout(layoutResponse.data.layout);
          setLoading(false);  // You can keep this if you're using it elsewhere
          setIsLoading(false);  // Add this line
          setError(null);
        }))
        .catch((err) => {
          console.error('API error:', err);
          if (err.response && err.response.status !== 404) {
            setError('User not found or other error');
          }
          setLoading(false);  // You can keep this if you're using it elsewhere
          setIsLoading(false);  // Add this line
        });
    } else {
      setLoading(false);  // You can keep this if you're using it elsewhere
      setIsLoading(false);  // Add this line
    }
  }, [username]);  

  const handleEdit = () => {
    navigate(`/${username}/edit`);
  };

    const [isLoading, setIsLoading] = useState(true); //Turn initial loading state for user dashboard on or off by setting true or false

  useEffect(() => {
    // Set isLoading to false when data is fetched
    // ...
  }, []);

  return (
    <>
      {isLoading ? (
        <SkeletonLoader />
      ) : (
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
      )}
    </>
  );

}

export default UserDashboard;
