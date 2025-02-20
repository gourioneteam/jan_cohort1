import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateProfile() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch the logged-in student's profile data
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

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

        // Set the form data with the fetched profile
        setFormData({
          name: response.data.name,
          email: response.data.email,
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile. Please try again later.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.put(
        `${apiUrl}/student/update-profile`,
        { email: formData.email }, // Only send the email for update
        { headers }
      );
      alert("Profile updated successfully");
      navigate("/view-profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again later.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            disabled // Disable the name field
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default UpdateProfile;