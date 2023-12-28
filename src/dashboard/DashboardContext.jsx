import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios'; // Ensure axios is imported if not already

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [dashboardLayout, setDashboardLayout] = useState('basic');
  const [dashboard, setDashboard] = useState(null);
  const [sections, setSections] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [backgroundStyle, setBackgroundStyle] = useState('style1');
  const [dashboardUserId, setDashboardUserId] = useState(null);
  const [error, setError] = useState(null); // To handle errors

  // Function to fetch dashboard data
  const fetchData = useCallback(async (dashboardUrl, backendUrl) => {
    if (!dashboardUrl) {
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/${dashboardUrl}`);
      setDashboard(response.data.dashboard);
      setSections(response.data.dashboard.sections); // Assuming 'sections' is part of the response
      setDashboardLayout(response.data.dashboard.layout);
      setBackgroundStyle(response.data.dashboard.backgroundStyle);
      setDashboardUserId(response.data.dashboard.dashboardUserId);
    } catch (err) {
      console.error("API error:", err);
      setError("An error occurred while fetching data");
    }
  }, []); // Empty dependency array if no dependencies

  const value = {
    dashboardLayout, setDashboardLayout,
    dashboard, setDashboard,
    sections, setSections,
    updateTrigger, setUpdateTrigger,
    backgroundStyle, setBackgroundStyle,
    dashboardUserId, setDashboardUserId,
    fetchData, // Exposing fetchData
    error, // Exposing error
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};