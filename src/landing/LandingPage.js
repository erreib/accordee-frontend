import React from 'react';  // Add useEffect and useRef
import { Link } from 'react-router-dom';
import ThreeFiberScene from './ThreeFiberScene';  // Import the new component

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faTh, faBolt } from '@fortawesome/free-solid-svg-icons';

import './LandingPage.scss';

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Accordee</h1>
        <nav>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </ul>
        </nav>
      </header>

      <section className="landing-banner">

        <div className="landing-banner-content">
          <h2>Welcome to Accordee Project</h2>
          <p>Your one-stop solution for a simple link dashboard. And I'm testing the CI behavior.</p>
        </div>

        <ThreeFiberScene />
        
      </section>

      <section className="landing-features">
        <h2>Unleash the Power of Personalization</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <FontAwesomeIcon icon={faTachometerAlt} />
            <h3>Intuitive Dashboard Editor</h3>
            <p>Our drag-and-drop editor makes it a breeze to design your personalized dashboard. No coding required.</p>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faTh} />
            <h3>Flexible Layouts</h3>
            <p>Choose from a wide variety of layouts to suit your unique needs. Fully responsive designs adapt to any screen size.</p>
          </div>
          <div className="feature-card">
            <FontAwesomeIcon icon={faBolt} />
            <h3>Real-Time Updates</h3>
            <p>See your changes reflect instantly. No more waiting or refreshing. Stay in the loop, in real time.</p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default LandingPage;
