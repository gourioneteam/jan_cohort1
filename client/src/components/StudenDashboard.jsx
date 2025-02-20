import React from 'react';
import NavBar from './Navbar';

function StudentDashboard({ user }) {
  return (
    <div className="dashboard">
      <h2>Welcome Student, {user.name}</h2>
      <div className="dashboard-content">
<NavBar />      </div>
    </div>
  );
}

export default StudentDashboard;