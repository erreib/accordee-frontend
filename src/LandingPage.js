import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.scss';

function CubeAnimation() {
  return (
    <div className="cube-container">
      <div className="cube">
        <div className="face front"></div>
        <div className="face back"></div>
        <div className="face right"></div>
        <div className="face left"></div>
        <div className="face top"></div>
        <div className="face bottom"></div>
      </div>
    </div>
  );
}

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
          <p>Your one-stop solution for a simple link dashboard.</p>
        </div>
        <CubeAnimation />
      </section>
      <section className="landing-features">
        <h2>Features</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Easy-to-use Dashboard Editor</h3>
            <p>Edit your dashboard with ease.</p>
          </div>
          <div className="feature-card">
            <h3>Customizable Layouts</h3>
            <p>Choose from a variety of layouts.</p>
          </div>
          <div className="feature-card">
            <h3>Instant Updates</h3>
            <p>See your changes instantly.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
