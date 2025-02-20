import React from 'react';
import AdminDashboard from './AdminDashboard';
import TrainerDashboard from './TrainerDashboard';
import StudentDashboard from './StudentDashboard';

function Dashboard({ user }) {
  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard user={user} />;
      case 'trainer':
        return <TrainerDashboard user={user} />;
      case 'student':
        return <StudentDashboard user={user} />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return renderDashboard();
}

export default Dashboard;