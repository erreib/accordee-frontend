import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../auth/UserContext"; // Adjust the import path as needed
import LoginForm from "../auth/LoginForm"; // <-- Import LoginForm
import FileUploader from './FileUploader'; // Import the new component
import axios from "axios";
import "./UserManager.scss";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const bucketUrl = import.meta.env.VITE_GCP_BUCKET_URL;

const UserManager = () => {
  const { user, logout } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [dashboards, setDashboards] = useState([]);
  const [isDashboardsVisible, setIsDashboardsVisible] = useState(false);
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const userManagerRef = useRef(null);
  const navigate = useNavigate();

  const location = useLocation();
  const currentPath = location.pathname;
  const isEditScreen = currentPath.includes("/edit");

  // Function to fetch dashboards
  const fetchDashboards = () => {
    return new Promise((resolve, reject) => {
      if (user && user.username) {
        axios
          .get(`${backendUrl}/users/${user.username}/dashboards`)
          .then((response) => {
            const sortedDashboards = response.data.sort((a, b) => a.dashboardid - b.dashboardid);
            setDashboards(sortedDashboards);
            resolve(sortedDashboards); // Resolve the promise with the fetched dashboards
          })
          .catch((error) => {
            console.error("Error fetching dashboards", error);
            reject(error); // Reject the promise on error
          });
      } else {
        resolve([]); // Resolve with an empty array if no user
      }
    });
  };

  // Fetch dashboards on component mount or when 'user' changes
  useEffect(() => {
    fetchDashboards();
  }, [user]);

  const handleCreateDashboard = () => {
    const token = localStorage.getItem('token'); // Assuming the token is stored in local storage
    const newDashboardUrl = prompt("Enter a new Dashboard URL:");
    if (newDashboardUrl) {
      // Construct the URL
      const createDashboardUrl = `${backendUrl}/users/${user.username}/dashboards/new-dashboard`;

      // API call to create a new dashboard
      axios
        .post(createDashboardUrl, { dashboardUrl: newDashboardUrl, title: "New Dashboard", layout: "basic" }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }) // Add other required fields as necessary
        .then((response) => {
          console.log("Dashboard created successfully", response.data);
          fetchDashboards(); // Re-fetch dashboards
        })
        .catch((error) => console.error("Error creating dashboard", error));
    }
  };

  const handleEditDashboard = (dashboardId, currentUrl) => {
    const token = localStorage.getItem('token'); // Assuming the token is stored in local storage
    const newDashboardUrl = prompt("Enter a new Dashboard URL:", currentUrl);

    // Check if the user actually entered a new URL
    if (newDashboardUrl && newDashboardUrl !== currentUrl) {
      const editDashboardUrl = `${backendUrl}/users/${user.username}/dashboards/edit/${dashboardId}`;

      // API call to edit the dashboard
      axios
        .put(editDashboardUrl, { newUrl: newDashboardUrl }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          console.log("Dashboard updated successfully", response.data);
          fetchDashboards(); // Re-fetch dashboards
          if (currentPath === `/${currentUrl}` || currentPath === `/${currentUrl}/edit`) {
            navigate(`/${newDashboardUrl}`); // Redirect to the new URL
          }
          // You might want to update your local state or re-fetch the list
        })
        .catch((error) => console.error("Error updating dashboard", error));
    }
  };

  const handleDeleteDashboard = (dashboardId) => {
    const token = localStorage.getItem('token'); // Assuming the token is stored in local storage
    const deleteDashboardUrl = `${backendUrl}/users/${user.username}/dashboards/delete/${dashboardId}`;

    // Confirmation dialog to prevent accidental deletion
    if (!window.confirm("Are you sure you want to delete this dashboard?")) {
      return;
    }

    // API call to delete the dashboard
    axios
      .delete(deleteDashboardUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        console.log("Dashboard deleted successfully", response.data);
        fetchDashboards().then((updatedDashboards) => {
          // Correctly determine the URL to compare
          const currentDashboardUrl = currentPath.split("/")[1]; // Assuming the path structure is like '/dashboard-url'
          const deletedDashboard = dashboards.find(d => d.dashboardid === dashboardId);

          if (deletedDashboard && currentDashboardUrl === deletedDashboard.dashboardurl) {
            if (updatedDashboards.length > 0) {
              navigate(`/${updatedDashboards[0].dashboardurl}`);
            } else {
              navigate(/* another appropriate path */);
            }
          }
        });
      })
      .catch((error) => console.error("Error deleting dashboard", error));
  };

  //Close expanded rows when clicking outside the usermanager area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userManagerRef.current && !userManagerRef.current.contains(event.target)) {
        setIsDashboardsVisible(false);
        setIsUploadVisible(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);  

  return (
    <div ref={userManagerRef} className="user-manager">
      {user && user.username ? (
        <>
          Logged in as {user.username}
          <button onClick={logout}>Logout</button>

          <button onClick={() => setIsDashboardsVisible(!isDashboardsVisible)}>
            {isDashboardsVisible ? '▼ ' : '► '} Manage Dashboards
          </button>
          <button onClick={() => setIsUploadVisible(!isUploadVisible)}>
            {isUploadVisible ? '▼ ' : '► '} Manage Uploads
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
                    <button onClick={() => handleEditDashboard(dashboard.dashboardid, dashboard.dashboardurl)}>Edit</button>
                    <button onClick={() => handleDeleteDashboard(dashboard.dashboardid)}>Delete</button>
                  </div>
                );
              })}
              <button onClick={handleCreateDashboard}>Add Dashboard</button>
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
