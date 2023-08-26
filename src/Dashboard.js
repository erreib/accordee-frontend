import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css'

function UserDashboard() {
  const { username } = useParams();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add this to handle loading state
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/dashboard/${username}`)
      .then((response) => {
        setDashboard(response.data.dashboard);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((err) => {
        setError('User not found or other error');
        setLoading(false); // Set loading to false once data is fetched
      });
  }, [username]);

  const handleEdit = () => {
    navigate(`/dashboard/${username}/edit`);
  };  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <CSSTransition in={!loading} timeout={300} classNames="transition">
    <div id="main-container" className="user-dashboard-container">

    <div className="floating-button-container">
        <span>User Dashboard for {username}</span>
        <button onClick={handleEdit}>Edit</button>
      </div>

      {/* Display error message if any */}
      {error && <div>{error}</div>}

      {/* Display the dashboard sections */}
      {!error && dashboard && (
        <div>
          <h2>{dashboard.title}</h2>
          <ul>
            {dashboard.sections.map((section, index) => (
              <li key={index} style={{ background: section.color }}>
                {section.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </CSSTransition>
  );
}

export default UserDashboard;
