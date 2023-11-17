import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../auth/UserContext';
import SpinnerLoader from '../loaders/SpinnerLoader';
import { useDashboard } from './DashboardContext';
import { Helmet } from 'react-helmet-async';

import '../App.scss'

const AccordionLayout = lazy(() => import('./layouts/accordion/AccordionLayout'));
const TabbedLayout = lazy(() => import('./layouts/tabbed/TabbedLayout'));
const BasicLayout = lazy(() => import('./layouts/basic/BasicLayout'));

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function UserDashboard({ isPreview }) {
  const { username } = useParams();
  const { user } = useUser();
  const [error, setError] = useState(null);

  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);

  const {
    dashboardLayout, setDashboardLayout,
    dashboard, setDashboard,
    updateTrigger
  } = useDashboard();

  const [backgroundStyle, setBackgroundStyle] = useState('style1');


  const navigate = useNavigate();


  useEffect(() => {
    async function fetchData() {
      if (!username) {
        return;
      }
  
      try {
        const [dashboardResponse, layoutResponse, backgroundResponse] = await Promise.all([
          axios.get(`${backendUrl}/${username}`),
          axios.get(`${backendUrl}/${username}/layout`),
          axios.get(`${backendUrl}/${username}/background-style`)
        ]);
  
        setDashboard(dashboardResponse.data.dashboard);
        setDashboardLayout(layoutResponse.data.layout);
        setBackgroundStyle(backgroundResponse.data.backgroundStyle);
      } catch (err) {
        console.error('API error:', err);
        setError('An error occurred while fetching data'); // Consider more specific error messages
      }
    }
  
    fetchData();
  }, [username, updateTrigger, setDashboard, setDashboardLayout]); // Removed the set functions from dependencies
  



  const handleEdit = () => {
    navigate(`/${username}/edit`);
  };


  return (
    <div id="main-container" className="user-dashboard-container">

      {!isPreview && (
        <Helmet>
          <title>{username} | Accordee Dashboard</title>
        </Helmet>
      )}

      {!isPreview && user && user.username === username && (
        <div className="floating-button-container">
          <span>User Dashboard for {username}</span>
          <button onClick={handleEdit}>Edit</button>
        </div>
      )}

      {!isPreview && (
        <div className={`dashboard-bg-element ${backgroundStyle}`}></div>
      )}

      {error && <div>{error}</div>}

      {!error && dashboard && (
        <div>

          <Suspense fallback={<SpinnerLoader />}>
            {dashboardLayout === 'accordion' && (
              <AccordionLayout dashboard={dashboard} selectedSection={selectedSection} setSelectedSection={setSelectedSection} />
            )}
          </Suspense>

          <Suspense fallback={<SpinnerLoader />}>
            {dashboardLayout === 'tabbed' && (
              <TabbedLayout dashboard={dashboard} selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
            )}
          </Suspense>

          <Suspense fallback={<SpinnerLoader />}>
            {dashboardLayout === 'basic' &&
              <BasicLayout sections={dashboard.sections} />}
          </Suspense>

        </div>
      )}
    </div>
  );

}

export default UserDashboard;
