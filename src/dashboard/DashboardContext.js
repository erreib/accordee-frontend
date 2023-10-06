import React, { createContext, useContext, useState } from 'react';

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
  const [dashboard, setDashboard] = useState(null); // New
  const [sections, setSections] = useState([]); // New
  const [updateTrigger, setUpdateTrigger] = useState(0); // New

  const value = {
    dashboardLayout,setDashboardLayout,
    dashboard,setDashboard, 
    sections,setSections, 
    updateTrigger,setUpdateTrigger
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
