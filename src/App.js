import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

import Dashboard from './dashboard/Dashboard';
import DashboardEditor from './dashboard/dashboard-editor/DashboardEditor';
import { DashboardProvider } from './dashboard/DashboardContext';

import Signup from './Signup';
import Login from './login/Login';
import LoginForm from './login/LoginForm';  // <-- Import LoginForm
import LandingPage from './landing/LandingPage';

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
  const [showLoginModal, setShowLoginModal] = useState(false);  // <-- Add this line

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
          {!showLoginModal && <button onClick={() => setShowLoginModal(true)}>Login</button>} {/* Show login button only when modal is not shown */}
          
          {showLoginModal && (
            <>
              <button onClick={() => setShowLoginModal(false)}>Close</button>
              <LoginForm />
            </>
          )}
        </>
      )}
    </div>
  );
}

function DashboardWithProvider(props) {
  return (
    <DashboardProvider>
      <Dashboard {...props} />
    </DashboardProvider>
  );
}

function DashboardEditorWithProvider(props) {
  return (
    <DashboardProvider>
      <DashboardEditor {...props} />
    </DashboardProvider>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <SignupButton />
        <UserStatus />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<LandingPage />} />
          <Route path=":username/edit" element={<DashboardEditorWithProvider />} />
          <Route path=":username" element={<DashboardWithProvider />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
