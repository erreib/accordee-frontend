import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HelmetProvider } from "react-helmet-async";

import Dashboard from './dashboard/Dashboard';
import DashboardEditor from './dashboard/dashboard-editor/DashboardEditor';
import { DashboardProvider } from './dashboard/DashboardContext';

import Signup from './auth/Signup';
import Login from './auth/Login';
import LoginForm from './auth/LoginForm';  // <-- Import LoginForm
import LandingPage from './landing/LandingPage';

import { UserProvider, useUser } from './auth/UserContext';
import { AxiosInterceptor } from './AxiosInterceptor'; // Adjust the path as needed

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
  const { user, logout } = useUser(); // Use logout from useUser hook
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="login-status">
      {user && user.username ? (
        <>
          Logged in as <Link className="username-link" to={`/${user.username}`}>{user.username}</Link> 
          <button className="logout-button" onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          Not logged in
          {!showLoginModal && <button onClick={() => setShowLoginModal(true)}>Login</button>}
          
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
    <HelmetProvider>
      <UserProvider>
        <Router>
          <AxiosInterceptor />
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
    </HelmetProvider>
  );
}

export default App;
