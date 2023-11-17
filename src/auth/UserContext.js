import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Load initial values from localStorage
  const initialUserId = localStorage.getItem('userId');
  const initialUsername = localStorage.getItem('username');
  const initialToken = localStorage.getItem('token');
  
  const [user, setUser] = useState({ id: initialUserId, username: initialUsername });
  const [token, setToken] = useState(initialToken);

  const logout = () => {
    // Clear user info from state
    setUser(null);
    setToken(null);

    // Clear user info from local storage
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  };

  // Save user info in localStorage whenever it changes
  useEffect(() => {
    if (user && user.id) {
      localStorage.setItem('userId', user.id);
    }
    if (user && user.username) {
      localStorage.setItem('username', user.username);
    }
  }, [user]);

  // Save token in localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserProvider;

export { UserContext };
