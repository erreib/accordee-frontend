import { useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext'; // Adjust the path as needed

// AxiosInterceptor listens for 401 or 403 errors and redirects the user to login  when detected (temporary
// solution for expiring bearer tokens until I create a proper session management)
export function AxiosInterceptor() {
  const navigate = useNavigate();
  const { logout } = useContext(UserContext); // Use the logout function from UserContext

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(response => {
      return response;
    }, error => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        logout(); // Call the logout function
        navigate('/login');
      }
      return Promise.reject(error);
    });

    // Cleanup the interceptor when the component unmounts
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate, logout]);

  return null;
}
