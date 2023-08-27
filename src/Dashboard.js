import React, { useEffect, useState } from 'react';
import NavRow from './NavRow';
import ContentArea from './ContentArea';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from './UserContext';
import './App.css'

function UserDashboard() {
  const { username } = useParams();
  const { user } = useUser();  // Get the current user from the context
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState(null);  // Local state for selected section
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/dashboard/${username}`)
      .then((response) => {
        setDashboard(response.data.dashboard);
        setLoading(false);
      })
      .catch((err) => {
        setError('User not found or other error');
        setLoading(false);
      });
  }, [username]);

  const handleEdit = () => {
    navigate(`/dashboard/${username}/edit`);
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
          {/* Here is the accordion interface, similar to your main page */}
          <div className="accordion">
            <NavRow 
              title={dashboard.title} 
              color="#B0BEC5" 
              onSelect={() => setSelectedSection(null)} 
              isShrinked={selectedSection !== null} 
            />
            {dashboard.sections.map((section, index) => (
              <React.Fragment key={index}>
                <NavRow
                  title={section.title}
                  color={section.color}
                  onSelect={() => setSelectedSection(index)}
                  isShrinked={selectedSection !== null && selectedSection !== index}
                  isSelected={selectedSection === index}
                />
                <ContentArea 
                  section={section.title} 
                  color={section.color} 
                  isActive={selectedSection === index} 
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
