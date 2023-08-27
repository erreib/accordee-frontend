import axios from 'axios';
import { useState } from 'react';
import { useUser } from './UserContext';

const Login = () => {
  const { setUser, setToken } = useUser();  // Add setToken here
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
      } catch (error) {
    
      console.error('Error logging in:', error);
      setError('Invalid username or password'); // Set an error message
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>} {/* Display the error message */}
    </div>
  );
};

export default Login;
