import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FeedbackForm = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [trainers, setTrainers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [ratings, setRatings] = useState({ knowledge: 0, communication: 0, punctuality: 0 });
  const [comments, setComments] = useState('');
  const [week, setWeek] = useState(1); // Assuming feedback is submitted for a particular week
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const userId = localStorage.getItem('userId'); // Assuming user info is saved in localStorage

  // Fetch trainer, course, and batch details when component mounts
  useEffect(() => {
    // Example API call to fetch batch details (trainer, course, batch)
    const token = localStorage.getItem("token"); // Assuming you store the auth token in localStorage

    axios.get(`${apiUrl}/student/batch-details`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(response => {
        // Extracting batch, course, and trainer information from response data
        const { data } = response.data;
        
        // Deconstruct the response data into separate arrays for batches, courses, and trainers
        const newBatches = data.map(item => item.batchId);
        const newCourses = data.map(item => item.courseId);
        const newTrainers = data.map(item => item.trainerId);

        setBatches(newBatches);
        setCourses(newCourses);
        setTrainers(newTrainers);
      })
      .catch(error => {
        setError('Failed to fetch batch information');
      });
  }, [userId]);

  // Handle rating changes
  const handleRatingChange = (field, value) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    const token = localStorage.getItem("token"); 
    event.preventDefault();

    if (!trainers.length || !courses.length || !batches.length) {
      setError('Missing trainer, course, or batch information.');
      return;
    }

    try {
      const response = await axios.post(`${apiUrl}/student/submit-feedback`, {
        trainerId: trainers[0]._id,  // Assuming only one trainer is selected
        courseId: courses[0]._id,    // Assuming only one course is selected
        batchId: batches[0]._id,     // Assuming only one batch is selected
        ratings,
        comments,
        week
      },{
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMessage(response.data.message);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while submitting feedback');
    }
  };

  return (
    <div className="feedback-form">
      <h2>Submit Feedback</h2>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="feedback-info">
        <p><strong>Trainer:</strong> {trainers.length ? trainers[0].name : 'Loading...'}</p>
        <p><strong>Course:</strong> {courses.length ? courses[0].name : 'Loading...'}</p>
        <p><strong>Batch:</strong> {batches.length ? batches[0].batchName : 'Loading...'}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="rating">
          <label>Knowledge</label>
          <input
            type="number"
            min="1"
            max="5"
            value={ratings.knowledge}
            onChange={(e) => handleRatingChange('knowledge', e.target.value)}
          />
        </div>
        <div className="rating">
          <label>Communication</label>
          <input
            type="number"
            min="1"
            max="5"
            value={ratings.communication}
            onChange={(e) => handleRatingChange('communication', e.target.value)}
          />
        </div>
        <div className="rating">
          <label>Punctuality</label>
          <input
            type="number"
            min="1"
            max="5"
            value={ratings.punctuality}
            onChange={(e) => handleRatingChange('punctuality', e.target.value)}
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
            onChange={(e) => setWeek(e.target.value)}
          />
        </div>

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackForm;
