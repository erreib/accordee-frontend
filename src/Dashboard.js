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
    // Check if the username parameter is valid before making the API request
    if (username) {
      axios.get(`http://localhost:5000/${username}`)
        .then((response) => {
          setDashboard(response.data.dashboard);
          setLoading(false);
          setError(null); // Clear any previous error
        })
        .catch((err) => {
          console.error('API error:', err);
          if (err.response && err.response.status !== 404) {
            setError('User not found or other error');
          }
          setLoading(false);
  
        });
    } else {
      setLoading(false); // No need to load anything if username is not available
    }
  }, [username]);
  
  const handleEdit = () => {
    navigate(`/${username}/edit`);
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
                  section={section} // Pass the entire section object, not just the title
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
