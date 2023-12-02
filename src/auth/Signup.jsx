import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import { useUser } from './UserContext';
import { Helmet } from 'react-helmet-async';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Signup = () => {
  const [email, setEmail] = useState(''); // Changed from username to email
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { setUser, setToken } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/auth/signup`, {
        email, // Send email instead of username
        password,
      });

      // Assume the server sends a token and userId upon successful signup
      const { userId, token } = response.data;

      // Derive username from email for the frontend
      const username = email.split('@')[0];

      // Update user state
      setUser({
        id: userId,
        username, // Derived username
      });

      // Update token state
      setToken(token);

      // Store in localStorage
      localStorage.setItem('userId', userId);
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);

      // Clear any errors
      setError(null);

      // Navigate to the user's dashboard
      navigate(`/${username}`);
    } catch (error) {
      console.error('Signup error:', error.response?.data?.message || error.message);
      setError('Could not sign up, please try again');
    }
  };

  return (
    <div className="portal-container">

      <Helmet>
        <title>Log in or Sign Up | Accordee</title>
      </Helmet>

      <h1>Signup</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            className="form-input"
            type="email" // Changed type to email for validation
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <button className="form-submit-button" type="submit">Signup</button>
          <p>By signing up, you agree to the <Link to="/terms-of-service">Terms of Service</Link>.</p>
        </div>
      </form>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default Signup;