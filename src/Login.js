// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser, setToken } = useUser();
  const [error, setError] = useState(null);


  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if the username and password fields are empty
    if (!username || !password) {
      setError("Both fields are required");
      return;
    }


    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        username,
        password,
      });

      // Assume the server sends a token upon successful login
      const { userId, token } = response.data.token;

      setUser({
        id: userId,
        username: username
      });

      setToken(token);

      localStorage.setItem('userId', userId);
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);

      setError(null);

      // Navigate to the user's dashboard (replace 'username' with the actual username)
      navigate(`/${username}`);
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="portal-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <input 
            className="form-input"
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <input 
            className="form-input"
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="form-submit-button" type="submit">Login</button>
      </form>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
  
}

export default Login;
