import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useUser } from './UserContext';

const Login = () => {
  const navigate = useNavigate();  // Use the navigate function
  const { setUser, setToken } = useUser();
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      const { userId, token } = response.data;

      setUser({
        id: userId,
        username: username
      });

      setToken(token);

      localStorage.setItem('userId', userId);
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);

      setError(null);

      navigate(`/dashboard/${username}`);  // Navigate to the user-specific dashboard
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid username or password');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;
