import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

import Dashboard from './Dashboard';
import DashboardEditor from './DashboardEditor';
import Signup from './Signup';
import Login from './Login';
import LandingPage from './LandingPage';
import { UserProvider, useUser } from './UserContext';

import './App.scss';

function SignupButton() {
  const location = useLocation();
  const isSignupPage = location.pathname === '/signup';
  return (
    <Link
      to={isSignupPage ? '/' : '/signup'}
      className="signup-button"
    >
      {isSignupPage ? 'Go to Home' : 'Signup'}
    </Link>
  );
}

function UserStatus() {
  const { user, setUser, setToken } = useUser();

  const handleLogout = () => {
    // Clear user state
    setUser(null);

    // Clear token state
    setToken(null);

    // Remove from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
  };

  return (
    <div className="login-status">
      {user && user.username ? (
        <>
          Logged in as <Link className="username-link" to={`/${user.username}`}>{user.username}</Link> 
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          Not logged in
          <Link className="login-link-button" to="/login">Login</Link>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <SignupButton />
        <UserStatus />
        <Routes>
          <Route path=":username/edit" element={<DashboardEditor />} />
          <Route path=":username" element={<Dashboard />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
