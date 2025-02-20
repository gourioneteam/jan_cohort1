import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewFeedback = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve token and userId from localStorage
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage

    // Debugging: Check if token and userId are available
    console.log('Token:', token);
    console.log('User ID:', userId);

    if (!token) {
      setError('No authorization token found or user is not logged in.');
      setLoading(false);
      return;
    }

    const fetchFeedback = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/student/feedback`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        // Assuming the backend response contains 'success' and 'data'
        if (response.data.success) {
          setFeedback(response.data.data);
        } else {
          setError('You are not enrolled in this batch or no feedback found.');
        }
      } catch (err) {
        console.error('Error fetching feedback:', err);
        if (err.response && err.response.status === 403) {
          // Handle 403 error: "You are not enrolled in this batch"
          setError('You are not enrolled in any batches for this course.');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch feedback. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []); // Dependency array: empty to run once on mount

  // Loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Error handling
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="view-feedback">
      <h2>Your Feedback</h2>

      {feedback.length === 0 ? (
        <p>No feedback submitted yet.</p>
      ) : (
        feedback.map((item, index) => (
          <div key={index} className="feedback-item">
            <h3>Batch: {item.batchId?.batchName || 'N/A'}</h3>
            <p><strong>Trainer:</strong> {item.trainerId?.name || 'N/A'}</p>
            <p><strong>Course:</strong> {item.courseId?.name || 'N/A'}</p>
            <p><strong>Week:</strong> {item.week}</p>

            <div className="ratings">
              <p><strong>Knowledge:</strong> {item.ratings?.knowledge || 'N/A'}</p>
              <p><strong>Communication:</strong> {item.ratings?.communication || 'N/A'}</p>
              <p><strong>Punctuality:</strong> {item.ratings?.punctuality || 'N/A'}</p>
            </div>

            <div className="comments">
              <p><strong>Comments:</strong> {item.comments || 'No comments provided'}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ViewFeedback;
