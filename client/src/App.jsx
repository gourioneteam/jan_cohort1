import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import NavBar from "./components/Navbar";
import Users from "./components/Users";
import Trainers from "./components/Trainers";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudenDashboard"
import TrainerDashboard from "./components/TrainerDashboard"; // Added Trainer Dashboard
import Courses from "./components/Courses";
import Batches from "./components/Batches";
import Allocations from "./components/Allocations";
import LandingPage from "./components/Landingpage";
import ProfileImageUpload from "./components/studentupload";
import BatchAllocationList from "./components/AllocatedBatch";
import ViewProfile from "./components/Viewprofile";
import UpdateProfile from "./components/Updateprofile";
import ViewBatchDetails from "./components/Viewbatchdetails";
import SubmitFeedback from "./components/SubmitFeedback";
import ViewFeedback from "./components/ViewFeedback";
import TrainerFeedbacks from "./components/receivedFeddbcak";
import TrainerBatchdetails from "./components/TrainerBatchdetails";

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const getDashboardRedirect = () => {
    if (user?.role === "admin") return "/adminDashboard";
    if (user?.role === "student") return "/studentDashboard";
    if (user?.role === "trainer") return "/trainerDashboard";
    return "/login";
  };

  return (
    <BrowserRouter>
      {isAuthenticated && <NavBar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route
          path="/"
          element={!isAuthenticated ? <LandingPage /> : <Navigate to={getDashboardRedirect()} />}
        />

        {/* Auth Routes */}
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to={getDashboardRedirect()} />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to={getDashboardRedirect()} />}
        />

        {/* Dashboard Routes */}
        <Route
          path="/adminDashboard"
          element={isAuthenticated && user?.role === "admin" ? <AdminDashboard user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/studentDashboard"
          element={isAuthenticated && user?.role === "student" ? <StudentDashboard user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/trainerDashboard"
          element={isAuthenticated && user?.role === "trainer" ? <TrainerDashboard user={user} /> : <Navigate to="/login" />}
        />

        {/* Admin Only Routes */}
        <Route
          path="/users"
          element={isAuthenticated && user?.role === "admin" ? <Users /> : <Navigate to="/adminDashboard" />}
        />
        <Route
          path="/trainers"
          element={isAuthenticated && user?.role === "admin" ? <Trainers /> : <Navigate to="/adminDashboard" />}
        />
        <Route
          path="/courses"
          element={isAuthenticated && user?.role === "admin" ? <Courses /> : <Navigate to="/adminDashboard" />}
        />
        <Route
          path="/batches"
          element={isAuthenticated && user?.role === "admin" ? <Batches /> : <Navigate to="/adminDashboard" />}
        />
        <Route
          path="/allocations"
          element={isAuthenticated && user?.role === "admin" ? <Allocations /> : <Navigate to="/adminDashboard" />}
        />
        <Route
          path="/batchdetails"
          element={isAuthenticated && user?.role === "admin" ? <BatchAllocationList /> : <Navigate to="/adminDashboard" />}
        />

        {/* Student Only Routes */}
        <Route
          path="/view-profile"
          element={isAuthenticated && user?.role === "student" ? <ViewProfile /> : <Navigate to="/studentDashboard" />}
        />
 <Route
          path="/update-profile"
          element={isAuthenticated && user?.role === "student" ? <UpdateProfile /> : <Navigate to="/studentDashboard" />}
        />
        <Route
          path="/update-profile-picture"
          element={isAuthenticated && user?.role === "student" ? <ProfileImageUpload /> : <Navigate to="/studentDashboard" />}
        />
         <Route
          path="/batch-details"
          element={isAuthenticated && user?.role === "student" ? <ViewBatchDetails /> : <Navigate to="/studentDashboard" />}
        />
        <Route
          path="/submit-feedback"
          element={isAuthenticated && user?.role === "student" ? <SubmitFeedback /> : <Navigate to="/studentDashboard" />}
        />
         <Route
          path="/view-submitted-feedback"
          element={isAuthenticated && user?.role === "student" ? <ViewFeedback /> : <Navigate to="/studentDashboard" />}
        />
             <Route
          path="/received-feedback"
          element={isAuthenticated && user?.role === "trainer" ? <TrainerFeedbacks/> : <Navigate to="/studentDashboard" />}
        />
             <Route
          path="/view-batch-details"
          element={isAuthenticated && user?.role === "trainer" ? <TrainerBatchdetails/> : <Navigate to="/studentDashboard" />}
        />

        {/* Catch-all Route */}
        <Route
          path="*"
          element={!isAuthenticated ? <Navigate to="/login" /> : <Navigate to={getDashboardRedirect()} />}
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
