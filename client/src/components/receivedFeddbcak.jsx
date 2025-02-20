import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TrainerFeedbacks = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authorization token found.');
      setLoading(false);
      return;
    }

    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(`${apiUrl}/trainer/feedbacks`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setFeedbacks(response.data.data);
          setStats(response.data.statistics);
        } else {
          setError('No feedback found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch feedback.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="trainer-feedbacks">
      <h2>Your Feedbacks</h2>
      
      <div className="feedback-stats">
        <h3>Statistics:</h3>
        <p><strong>Average Knowledge:</strong> {stats.avgKnowledge?.toFixed(1) || 0}</p>
        <p><strong>Average Communication:</strong> {stats.avgCommunication?.toFixed(1) || 0}</p>
        <p><strong>Average Punctuality:</strong> {stats.avgPunctuality?.toFixed(1) || 0}</p>
        <p><strong>Total Feedbacks:</strong> {stats.totalFeedbacks || 0}</p>
      </div>

      {feedbacks.length === 0 ? (
        <p>No feedback received yet.</p>
      ) : (
        feedbacks.map((item, index) => (
          <div key={index} className="feedback-item">
    
            <p><strong>Batch:</strong> {item.batchId?.batchName}</p>
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

export default TrainerFeedbacks;
