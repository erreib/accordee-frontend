import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../auth/UserContext';
import SpinnerLoader from '../loaders/SpinnerLoader';
import { useDashboard } from './DashboardContext';
import { Helmet } from 'react-helmet-async';

import FloatingSpheres from './backgrounds/scenes/FloatingSpheres';
import DynamicWave from './backgrounds/scenes/DynamicWave';

import '../App.scss'
import './backgrounds/backgroundStyles.scss'

const AccordionLayout = lazy(() => import('./layouts/accordion/AccordionLayout'));
const TabbedLayout = lazy(() => import('./layouts/tabbed/TabbedLayout'));
const BasicLayout = lazy(() => import('./layouts/basic/BasicLayout'));

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function UserDashboard({ isPreview }) {
  const { dashboardUrl } = useParams();
  const { user } = useUser();
  const [error, setError] = useState(null);

  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);

  const {
    dashboard, setDashboard,
    dashboardLayout, setDashboardLayout,
    backgroundStyle, setBackgroundStyle,
    updateTrigger
  } = useDashboard();

  const [dashboardUserId, setDashboardUserId] = useState(null); // Or however you initialize it

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      if (!dashboardUrl) {
        return;
      }

      try {
        const response = await axios.get(`${backendUrl}/${dashboardUrl}`);
        setDashboard(response.data.dashboard);
        setDashboardLayout(response.data.dashboard.layout);
        setBackgroundStyle(response.data.dashboard.backgroundStyle);
        setDashboardUserId(response.data.dashboard.dashboardUserId);
      } catch (err) {
        console.error("API error:", err);
        setError("An error occurred while fetching data");
      }
    }

    fetchData();
  }, [updateTrigger, dashboardUrl, setDashboard, setDashboardLayout, setBackgroundStyle, setDashboardUserId]);

  const handleEdit = () => {
    navigate(`/${dashboardUrl}/edit`);
  };

  const renderBackground = () => {
    const backgroundComponent = (() => {
      switch (backgroundStyle) {
        case 'style2':
          return <FloatingSpheres />;
        case 'style3':
          return <DynamicWave />;
        // ... other cases
        default:
          return null;
      }
    })();

    return backgroundComponent;
  };

  return (
    <div
      id="user-dashboard-container"
      className={`user-dashboard-container ${isPreview ? "preview-mode" : ""}`}
    >
      {!isPreview && (
        <Helmet>
          <title>
            {dashboard
              ? `${dashboard.title} | Accordee Dashboard`
              : "Loading Dashboard..."}
          </title>
        </Helmet>
      )}

      {!isPreview && user && dashboardUserId !== null && Number(user.id) === Number(dashboardUserId) && (
        <div className="floating-button-container">
          <span>User Dashboard for {user.username}</span>
          <span>Dashboard url: accord.ee/{dashboardUrl}</span>
          <button onClick={handleEdit}>Edit</button>
        </div>
      )}

      <div
        className={`dashboard-bg-element ${backgroundStyle} ${isPreview ? "preview-background-container" : ""
          }`}
      >
        {isPreview ? (
          <div className="preview-background-inner-container">
            {renderBackground()}
          </div>
        ) : (
          renderBackground()
        )}
      </div>

      {error && <div>{error}</div>}

      {!error && dashboard && (
        <div>
          <Suspense fallback={<SpinnerLoader />}>
            {dashboardLayout === "accordion" && (
              <AccordionLayout
                dashboard={dashboard}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
              />
            )}
          </Suspense>

          <Suspense fallback={<SpinnerLoader />}>
            {dashboardLayout === "tabbed" && (
              <TabbedLayout
                dashboard={dashboard}
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
              />
            )}
          </Suspense>

          <Suspense fallback={<SpinnerLoader />}>
            {dashboardLayout === "basic" && (
              <BasicLayout sections={dashboard.sections} />
            )}
          </Suspense>
        </div>
      )}
    </div>
  );

}

export default UserDashboard;
