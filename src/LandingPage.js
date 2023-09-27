
import { Link } from 'react-router-dom';
import './LandingPage.css'


function LandingPage() {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Accordion Project</h1>
        <nav>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </ul>
        </nav>
      </header>
      <section className="landing-banner">
        <h2>Welcome to Accordion Project</h2>
        <p>Your one-stop solution for managing dashboards.</p>
      </section>
      <section className="landing-features">
        <h2>Features</h2>
        <ul>
          <li>Easy-to-use Dashboard Editor</li>
          <li>Customizable Layouts</li>
          <li>Instant Updates</li>
        </ul>
      </section>
      
<div className="cube-container">
  <div className="cube">
    <div className="front"></div>
    <div className="back"></div>
    <div className="left"></div>
    <div className="right"></div>
    <div className="top"></div>
    <div className="bottom"></div>
  </div>
</div>

    </div>
  );
}

export default LandingPage;
