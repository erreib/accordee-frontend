import { BrowserRouter, Route, Routes, useNavigate, useLocation, Link } from "react-router-dom";

import Dashboard from './dashboard/Dashboard';
import DashboardEditor from './dashboard/DashboardEditor';
import { DashboardProvider } from './dashboard/DashboardContext';

import LandingPage from './LandingPage';

import {
  useClerk,
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  RedirectToSignIn,
  SignIn,
  SignUp
} from "@clerk/clerk-react";

import './App.scss';

// if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
//   throw new Error("Missing Publishable Key")
// }

// const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function UserStatus() {
  const { isLoaded, isSignedIn, user } = useUser();
  const clerk = useClerk();
  const navigate = useNavigate();
  const location = useLocation(); // <-- Add this line to get the current location

  const handleSignOut = () => {
    clerk.signOut().then(() => {
      // Check if the current location includes '/edit'
      if (location.pathname.includes('/edit')) {
        navigate(`/${user.username}`);
      }
      // No need to navigate if they're not on the '/edit' page
    });
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="login-status">
      <div>Hello, {user.firstName} welcome to Clerk</div>
      <div>UserID: {user.id}</div>
      <div>Username: <Link className="username-link" to={`/${user.username}`}>{user.username}</Link></div>

      <UserButton />
      <button onClick={() => handleSignOut(user, navigate)}>Logout</button>

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

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();
 
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      navigate={(to) => navigate(to)}
    >

      <UserStatus />
      
      <Routes>
        <Route path="/" element={<LandingPage  />} />
        
        <Route
          path="/sign-in/*"
          element={<SignIn routing="path" path="/sign-in" />}
        />
        <Route
          path="/sign-up/*"
          element={<SignUp routing="path" path="/sign-up" />}
        />

        <Route path=":username" element={
          <DashboardWithProvider />
        } />

        <Route path=":username/edit" element={
          <>
            <SignedIn>
              <DashboardEditorWithProvider />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        } />

      </Routes>
    </ClerkProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ClerkProviderWithRoutes />
    </BrowserRouter>
  );
}

export default App;
