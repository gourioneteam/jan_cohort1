import React, { useEffect, useState } from "react";
import axios from "axios";

const FeedbackForm = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [trainer, setTrainer] = useState(null);
  const [course, setCourse] = useState(null);
  const [batch, setBatch] = useState(null);
  const [ratings, setRatings] = useState({ knowledge: 0, communication: 0, punctuality: 0 });
  const [comments, setComments] = useState("");
  const [week, setWeek] = useState(1); // Feedback is given for a specific week
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const userId = localStorage.getItem("userId"); // Get logged-in user ID

  // Fetch batch details on component mount
  useEffect(() => {
    axios
      .get(`${apiUrl}/student/batch-details?userId=${userId}`)
      .then((response) => {
        const { trainer, course, batch } = response.data;
        setTrainer(trainer);
        setCourse(course);
        setBatch(batch);
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Failed to fetch batch information");
      });
  }, [userId]);

  // Handle rating input changes
  const handleRatingChange = (field, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [field]: Math.min(5, Math.max(1, value)), // Ensure values stay between 1-5
    }));
  };

  // Submit feedback
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!trainer || !course || !batch) {
      setError("Missing trainer, course, or batch information.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/student/feedback`,
        {
          trainerId: trainer._id,
          courseId: course._id,
          batchId: batch._id,
          ratings,
          comments,
          week,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Send token for authentication
          },
        }
      );

      setSuccessMessage(response.data.message);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred while submitting feedback");
    }
  };

  return (
    <div className="feedback-form">
      <h2>Submit Feedback</h2>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="feedback-info">
        <p><strong>Trainer:</strong> {trainer ? trainer.name : "Loading..."}</p>
        <p><strong>Course:</strong> {course ? course.name : "Loading..."}</p>
        <p><strong>Batch:</strong> {batch ? batch.batchName : "Loading..."}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="rating">
          <label>Knowledge (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={ratings.knowledge}
            onChange={(e) => handleRatingChange("knowledge", parseInt(e.target.value))}
          />
        </div>
        <div className="rating">
          <label>Communication (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={ratings.communication}
            onChange={(e) => handleRatingChange("communication", parseInt(e.target.value))}
          />
        </div>
        <div className="rating">
          <label>Punctuality (1-5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={ratings.punctuality}
            onChange={(e) => handleRatingChange("punctuality", parseInt(e.target.value))}
          />
        </div>

        <div className="comments">
          <label>Comments</label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Enter your comments here..."
          />
        </div>

        <div className="week-selection">
          <label>Week</label>
          <input
            type="number"
            min="1"
            value={week}
            onChange={(e) => setWeek(parseInt(e.target.value))}
          />
        </div>

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackForm;
