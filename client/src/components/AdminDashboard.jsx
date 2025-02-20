import React from 'react';

function AdminDashboard({ user }) {
  return (
    <div className="dashboard">
      <h2>Welcome Admin, {user.name}</h2>
      <div className="dashboard-stats">
        
      </div>
    </div>
  );
}

export default AdminDashboard;