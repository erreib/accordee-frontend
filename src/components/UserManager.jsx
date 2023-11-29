import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../auth/UserContext"; // Adjust the import path as needed
import LoginForm from "../auth/LoginForm"; // <-- Import LoginForm
import FileUploader from './FileUploader'; // Import the new component
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const bucketUrl = import.meta.env.VITE_GCP_BUCKET_URL;

const UserManager = () => {
  const { user, logout } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [dashboards, setDashboards] = useState([]);
  const [isDashboardsVisible, setIsDashboardsVisible] = useState(false);
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const currentPath = location.pathname;
  const isEditScreen = currentPath.includes("/edit");

  useEffect(() => {
    if (user && user.username) {
      axios
        .get(`${backendUrl}/users/${user.username}/dashboards`)
        .then((response) => {
          const sortedDashboards = response.data.sort((a, b) => a.dashboardid - b.dashboardid);
          setDashboards(sortedDashboards);
        })
        .catch((error) => console.error("Error fetching dashboards", error));
    }
  }, [user]);

  const handleCreateDashboard = () => {
    const newDashboardUrl = prompt("Enter a new Dashboard URL:");
    if (newDashboardUrl) {
      // API call to create new dashboard
      // Replace 'createDashboardUrl' with the actual URL to create the dashboard
      axios
        .post(`createDashboardUrl`, { newDashboardUrl, userId: user.id })
        .then((response) => {
          // Fetch and update dashboards list
        })
        .catch((error) => console.error("Error creating dashboard", error));
    }
  };

  const handleDeleteDashboard = (dashboardId) => {
    // API call to delete the dashboard
    // Replace 'deleteDashboardUrl' with the actual URL to delete the dashboard
    axios
      .delete(`deleteDashboardUrl/${dashboardId}`)
      .then((response) => {
        // Fetch and update dashboards list
      })
      .catch((error) => console.error("Error deleting dashboard", error));
  };

  return (
    <div className="login-status">
      {user && user.username ? (
        <>
          Logged in as {user.username}
          <button onClick={logout}>Logout</button>
          <button onClick={() => setIsDashboardsVisible(!isDashboardsVisible)}>
            Manage Dashboards
          </button>
          <button onClick={() => setIsUploadVisible(!isUploadVisible)}>
            Manage Uploads
          </button>

          {isDashboardsVisible && (
            <div className="dashboard-management">
              {dashboards.map((dashboard) => {
                const dashboardBasePath = `/${dashboard.dashboardurl}`;
                const dashboardEditPath = `${dashboardBasePath}/edit`;
                const isCurrentDashboard = isEditScreen
                  ? currentPath === dashboardEditPath
                  : currentPath === dashboardBasePath;
                const dashboardLinkPath = isEditScreen
                  ? dashboardEditPath
                  : dashboardBasePath;

                return (
                  <div key={dashboard.dashboardid}>
                    {isCurrentDashboard ? (
                      <span>{dashboard.dashboardurl}</span>
                    ) : (
                      <Link to={dashboardLinkPath}>
                        {dashboard.dashboardurl}
                      </Link>
                    )}
                    {/* Uncomment and complete these buttons as needed */}
                    {/* <button onClick={() => handleEditDashboard(dashboard.dashboardurl)}>Edit</button> */}
                    {/* <button onClick={() => handleDeleteDashboard(dashboard.dashboardid)}>Delete</button> */}
                  </div>
                );
              })}
              {/* Placeholder for Add Dashboard logic */}
            </div>
          )}

          {isUploadVisible && (
            <div className="file-uploader-section">
              <h3>File Uploader</h3>
              <FileUploader
                username={user.username}
                backendUrl={backendUrl}
                bucketUrl={bucketUrl}
              />
            </div>
          )}

        </>
      ) : (
        <>
          Not logged in
          {!showLoginModal && (
            <button onClick={() => setShowLoginModal(true)}>Login</button>
          )}
          {showLoginModal && (
            <>
              <button onClick={() => setShowLoginModal(false)}>Close</button>
              <LoginForm />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UserManager;
