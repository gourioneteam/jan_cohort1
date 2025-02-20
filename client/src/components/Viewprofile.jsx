import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ViewProfile() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      // Redirect to login if no token is found
      if (!token) {
        navigate("/login");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      try {
        const response = await axios.get(
          `${apiUrl}/student/profile`,
          { headers }

        );
        console.log(response)

        // Set the profile data if the request is successful
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);

        // Handle specific error cases
        if (error.response) {
          if (error.response.status === 401) {
            // Unauthorized (e.g., invalid or expired token)
            setError("You are not authorized. Please log in again.");
            navigate("/login");
          } else if (error.response.status === 404) {
            // Student not found
            setError("Profile not found.");
          } else {
            // Other server errors
            setError("An error occurred while fetching the profile.");
          }
        } else if (error.request) {
          // Network errors (e.g., no response from the server)
          setError("Network error. Please check your connection.");
        } else {
          // Other errors
          setError("An unexpected error occurred.");
        }
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div>
      <h2>Profile</h2>
      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : profile ? (
        <div>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          {profile.createdBy && (
            <p>
              Created By: {profile.createdBy.name} ({profile.createdBy.email})
            </p>
          )}
          {profile.profileImageUrl && (
            <img
              src={profile.profileImageUrl}
              alt="Profile"
              style={{ width: "100px", height: "100px", borderRadius: "50%" }}
            />
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default ViewProfile;