import React, { useState, useEffect } from "react";
import axios from "axios";

const ProfileImageUpload = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfileImage();
  }, []);

  // Fetch the current profile image
  const fetchProfileImage = async () => {
    try {
      const response = await axios.get(`${apiUrl}/student/profile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProfileImageUrl(response.data.profileImageUrl);
    } catch (error) {
      console.error("Error fetching profile image:", error.response?.data || error.message);
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Upload profile image
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("profileImage", selectedFile);

    try {
      const response = await axios.post(`${apiUrl}/student/upload-profile`
      , formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`        },
      });

      setProfileImageUrl(response.data.profileImageUrl);
      setSelectedFile(null);
      setPreviewImage(null);
      setLoading(false);
    } catch (error) {
      console.error("Error uploading image:", error.response?.data || error.message);
      setError("Failed to upload image");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Profile Image</h2>

      {/* Display current profile image */}
      {profileImageUrl && (
        <div>
          <h4>Current Profile Picture:</h4>
          <img src={profileImageUrl} alt="Profile" width="150"
           style={{ borderRadius: "50%" }} />
        </div>
      )}

      {/* Image Preview before uploading */}
      {previewImage && (
        <div>
          <h4>Preview:</h4>
          <img src={previewImage} alt="Preview" width="150" 
          style={{ borderRadius: "50%" }} />
        </div>
      )}

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ProfileImageUpload;
