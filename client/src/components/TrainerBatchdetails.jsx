import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TrainerBatchdetails = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authorization token found.');
      setLoading(false);
      return;
    }

    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/trainer/students', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setStudents(response.data.data);
        } else {
          setError('No students found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch students.');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="trainer-students">
      <h2>Students Assigned to You</h2>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        students.map((student, index) => (
          <div key={index} className="student-item">
            <h3>{student.studentId?.name}</h3>
            <p>Email: {student.studentId?.email}</p>
            <p>Course: {student.courseId?.name}</p>
            <p>Batch: {student.batchId?.batchName}</p>
            <p>Start Date: {new Date(student.batchId?.startDate).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default TrainerBatchdetails;
