import React, { useEffect, useRef } from 'react';  // Add useEffect and useRef
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

function BubbleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    canvas.addEventListener('mousemove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    });

    const bubbles = [];
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 30 + 10;
      bubbles.push({ x, y, size, dx: 0, dy: -2 });
    }

    const drawBubbles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const bubble of bubbles) {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(173, 216, 230, 0.2)';
        ctx.fill();

        const distanceToMouseX = mouseX - bubble.x;
        const distanceToMouseY = mouseY - bubble.y;
        const distanceToMouse = Math.sqrt(distanceToMouseX ** 2 + distanceToMouseY ** 2);

        if (distanceToMouse < 150) {
          bubble.dx = distanceToMouseX / 100;
          bubble.dy = distanceToMouseY / 100;
        } else {
          bubble.dy = -2;
          bubble.dx = 0;
        }

        bubble.x += bubble.dx;
        bubble.y += bubble.dy;

        if (bubble.y + bubble.size < 0) {
          bubble.y = canvas.height + bubble.size;
        }
      }
      requestAnimationFrame(drawBubbles);
    };
    ctx.fillStyle = '#33333';

    drawBubbles();
  }, []);

  return (
    <canvas ref={canvasRef} className="bubble-background"></canvas>
  );
}

function LandingPage() {
  return (
    <div className="landing-page">
      <BubbleBackground />
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
