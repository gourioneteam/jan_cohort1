import React from "react";
import { Link } from "react-router-dom";

function NavBar({ user, onLogout }) {
  return (
    <nav>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>

        {/* Admin Navigation */}
        {user?.role === "admin" && (
          <>
            <li><Link to="/users">Users</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/batches">Batches</Link></li>
            <li><Link to="/allocations">Allocations</Link></li>
            <li><Link to="/batchdetails">Batchdetails</Link></li>

            <li><Link to="/feedback">Feedback</Link></li>
          </>
        )}

        {/* Student Navigation */}
        {user?.role === "student" && (
          <>
            <li><Link to="/view-profile">View Profile</Link></li>
            <li><Link to="/update-profile">Update Profile</Link></li>
            <li><Link to="/update-profile-picture">Update Profile Picture</Link></li>
            <li><Link to="/batch-details">View Batches</Link></li>
            <li><Link to="/submit-feedback">Submit Feedback</Link></li>
          </>
        )}

        {/* Trainer Navigation */}
        {user?.role === "trainer" && (
          <>
            <li><Link to="/view-batch-details">View Batch Details</Link></li>
            <li><Link to="/received-feedback">Received Feedback & Ratings</Link></li>
          </>
        )}

        {/* Logout Button */}
        <li>
          <button onClick={onLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
