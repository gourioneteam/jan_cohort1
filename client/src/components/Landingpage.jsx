import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="landing-container">
      <h1>Welcome to Training Management System</h1>
      <div className="auth-buttons">
        <Link to="/login" className="auth-button">Login</Link>
        <Link to="/register" className="auth-button">Register as Admin</Link>
      </div>
    </div>
  );
}

export default LandingPage;