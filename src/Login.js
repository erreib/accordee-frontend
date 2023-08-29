// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from './UserContext';

import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser, setToken } = useUser();
  const [error, setError] = useState(null);


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
