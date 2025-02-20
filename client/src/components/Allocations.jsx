import React, { useState, useEffect } from "react";
import axios from "axios";

const BatchAllocation = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    batchId: "",
    trainerId: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch initial data (students, courses, batches, trainers)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch students, courses, batches, and trainers
        const [studentsRes, coursesRes, batchesRes, trainersRes] =
          await Promise.all([
            axios.get(`${apiUrl}/admin/get-students`, { headers }),
            axios.get(`${apiUrl}/admin/get-courses`, { headers }),
            axios.get(`${apiUrl}/admin/list-batches`, { headers }),
            axios.get(`${apiUrl}/admin/get-trainers`, { headers }),
          ]);
          console.log(trainersRes.data)
        setStudents(studentsRes.data);
        setCourses(coursesRes.data);
        setBatches(batchesRes.data.batches);
        setTrainers(trainersRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Send allocation request to the backend
      const response = await axios.post(
        `${apiUrl}/admin/allocate-batch`,
        formData,
        { headers }
      );

      if (response.data.success) {
        setSuccess(true);
        setFormData({ studentId: "", courseId: "", batchId: "", trainerId: "" }); // Reset form
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error allocating student to batch");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Allocate Student to Batch</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Student:</label>
          <select
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name} ({student.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Course:</label>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Batch:</label>
          <select
            name="batchId"
            value={formData.batchId}
            onChange={handleChange}
            required
          >
            <option value="">Select a batch</option>
            {batches.map((batch) => (
              <option key={batch._id} value={batch._id}>
                {batch.batchName} (Starts: {batch.startDate})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Trainer:</label>
          <select
            name="trainerId"
            value={formData.trainerId}
            onChange={handleChange}
            required
          >
            <option value="">Select a trainer</option>
            {trainers.map((trainer) => (
              <option key={trainer._id} value={trainer._id}>
                {trainer.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Allocate Student</button>
      </form>

      {success && (
        <div style={{ color: "green", marginTop: "10px" }}>
          Student allocated successfully!
        </div>
      )}
    </div>
  );
};

export default BatchAllocation;