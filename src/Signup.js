import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { setUser, setToken } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/auth/signup`, {
        username,
        password,
      });

      // Assume the server sends a token upon successful signup
      const { userId, token } = response.data;

      // Update user state
      setUser({
        id: userId,
        username: username,
      });

      // Update token state
      setToken(token);

      // Store in localStorage
      localStorage.setItem('userId', userId);
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);

      // Clear any errors
      setError(null);

      // Navigate to the user's dashboard (replace 'username' with the actual username)
      navigate(`/${username}`);
    } catch (error) {
      console.error('Signup error:', error);
      setError('Could not sign up, please try again');
    }
  };

  return (
    <div>
      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Signup</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Signup;