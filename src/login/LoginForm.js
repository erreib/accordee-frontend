import React, { useState } from "react";
import axios from "axios";
import { useUser } from '../UserContext';
import { useNavigate } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const LoginForm = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setUser, setToken } = useUser();
  const navigate = useNavigate();

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
  
      // Assume the server sends a token and userId upon successful login
      const { userId, token } = response.data;  // Corrected this line
  
      setUser({
        id: userId,
        username: username
      });
  
      setToken(token);
  
      localStorage.setItem('userId', userId);
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
  
      setError(null);

      onClose && onClose();  // Close the modal if the onClose prop is provided
  
      // Navigate to the user's dashboard (replace 'username' with the actual username)
      navigate(`/${username}`);
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid username or password');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <div>{error}</div>}
      <button type="submit">Submit</button>
    </form>
  );
};

export default LoginForm;
