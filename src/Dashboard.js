import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from './UserContext';
import './App.css'
import SpinnerLoader from './loaders/SpinnerLoader';

const AccordionLayout = lazy(() => import('./layouts/accordion/AccordionLayout'));
const TabbedLayout = lazy(() => import('./layouts/tabbed/TabbedLayout'));
const BasicLayout = lazy(() => import('./layouts/basic/BasicLayout'));

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function UserDashboard() {
  const { username } = useParams();
  const { user } = useUser();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);

  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);

  const [layoutChoice, setDashboardLayout] = useState('basic');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      if (!username) {
        return;
      }
  
      try {
        const [dashboardResponse, layoutResponse] = await Promise.all([
          axios.get(`${backendUrl}/${username}`),
          axios.get(`${backendUrl}/${username}/layout`)
        ]);
  
        setDashboard(dashboardResponse.data.dashboard);
        setDashboardLayout(layoutResponse.data.layout);
        setError(null);
      } catch (err) {
        console.error('API error:', err);
        setError('User not found or other error');
      } finally {
      }
    }
  
    fetchData();
  });

  const handleEdit = () => {
    navigate(`/${username}/edit`);
  };


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

              <Suspense fallback={<SpinnerLoader />}>
                {layoutChoice === 'accordion' && (
                  <AccordionLayout dashboard={dashboard} selectedSection={selectedSection} setSelectedSection={setSelectedSection} />
                )}
              </Suspense>

              <Suspense fallback={<SpinnerLoader />}>
                {layoutChoice === 'tabbed' && (
                  <TabbedLayout dashboard={dashboard} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
                )}
              </Suspense>

              <Suspense fallback={<SpinnerLoader />}>
              {layoutChoice === 'basic' && 
                <BasicLayout sections={dashboard.sections} />}
              </Suspense>

            </div>
          )}
        </div>
  );

}

export default UserDashboard;
