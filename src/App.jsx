import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HelmetProvider } from "react-helmet-async";

import Dashboard from './dashboard/Dashboard';
import DashboardEditor from './dashboard/dashboard-editor/DashboardEditor';
import { DashboardProvider } from './dashboard/DashboardContext';

import LandingPage from './landing/LandingPage';
import Signup from './auth/Signup';
import Login from './auth/Login';
import { UserProvider, useUser } from './auth/UserContext';
import { AxiosInterceptor } from './auth/AxiosInterceptor'; // Adjust the path as needed
import UserManager from './components/UserManager';


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
          <UserManager />
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<LandingPage />} />
            <Route path=":dashboardUrl/edit" element={<DashboardEditorWithProvider />} />
            <Route path=":dashboardUrl" element={<DashboardWithProvider />} />
          </Routes>
        </Router>
      </UserProvider>
    </HelmetProvider>
  );
}

export default App;
