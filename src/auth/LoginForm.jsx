import React, { useState } from "react";
import axios from "axios";
import { useUser } from './UserContext';
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const LoginForm = ({ onClose }) => {
  const [login, setLogin] = useState(""); // Generalized to 'login' instead of 'username'
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { setUser, setToken } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!login || !password) {
      setError("Both fields are required");
      return;
    }
    
    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        login, // Changed to 'login'
        password,
      });
  
      const { userId, token } = response.data;
  
      // Assuming the backend sends the username as part of the response
      // Otherwise, you can derive it from 'login' if it's an email
      const username = response.data.username || (login.includes('@') ? login.split('@')[0] : login);

      setUser({ id: userId, username });
      setToken(token);
  
      localStorage.setItem('userId', userId);
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
  
      setError(null);

      onClose && onClose();
  
      navigate(`/${username}`);
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      setError('Invalid username/email or password');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Username/Email</label>
        <input
          type="text" // Can stay as type "text" to accept both username and email
          placeholder="Username or Email" // Updated placeholder
          value={login}
          onChange={(e) => setLogin(e.target.value)}
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
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
