import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

import Dashboard from './Dashboard';
import DashboardEditor from './DashboardEditor';

import Signup from './Signup';
import Login from './Login';

import { UserProvider, useUser } from './UserContext';

import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './App.css';

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

function AnimatedSwitch() {
  const location = useLocation();
  let key = location.pathname.split('/')[1] || '/';

  return (
    <TransitionGroup className="transition-group" style={{ position: 'relative' }}>
      <CSSTransition
        key={key}
        classNames="slide" // Assuming slide is your transition class
        timeout={{ enter: 300, exit: 300 }}
      >
        <section className="route-section" style={{ position: 'absolute', width: '100%', top: 0 }}>
          <Routes>
            <Route path=":username/edit" element={<DashboardEditor />} />
            <Route path=":username" element={<Dashboard />} />
          </Routes>
        </section>
      </CSSTransition>
    </TransitionGroup>
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
          Logged in as {user.username} 
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          Not logged in
          <Link to="/login">Login</Link> {/* Change "/login" to the path of your login page */}
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <AnimatedSwitch />
        <SignupButton />
        <UserStatus />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div>Accordion Project</div>} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
