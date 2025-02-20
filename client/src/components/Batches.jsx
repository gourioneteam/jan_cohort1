import React, { useState, useEffect } from "react";
import axios from "axios";

const BatchManagement = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [batches, setBatches] = useState([]);
  const [newBatch, setNewBatch] = useState({ batchName: "", startDate: "", trainerId: "", courseId: "" });
  const [editingBatchId, setEditingBatchId] = useState(null);
  const [trainers, setTrainers] = useState([]); // Store trainers list
  const [courses, setCourses] = useState([]); // Store courses list

  useEffect(() => {
    fetchBatches();
    fetchAvailableOptions();
  }, []);

  // Fetch Batches
  const fetchBatches = async () => {
    try {
      const response = await axios.get(`${apiUrl}//admin/list-batches`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBatches(response.data.batches);
    } catch (error) {
      console.error("Error fetching batches:", error.response?.data || error.message);
    }
  };

  // Fetch available trainers and courses for the dropdown
  const fetchAvailableOptions = async () => {
    try {
      const response = await axios.get(`${apiUrl}/admin/get-trainers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const responsecourse = await axios.get(`${apiUrl}/admin/get-courses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log(response.data)
      setTrainers(response.data); // Trainers list
      console.log(trainers)
      setCourses(responsecourse.data); // Courses list
    } catch (error) {
      console.error("Error fetching options:", error.response?.data || error.message);
    }
  };

  // Add or Update Batch
  const handleSaveBatch = async () => {
    try {
      if (editingBatchId) {
        await axios.put(`${apiUrl}/admin/update-batch/${editingBatchId}`, newBatch, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await axios.post(`${apiUrl}/admin/add-batch`, newBatch, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      fetchBatches();
      setNewBatch({ batchName: "", startDate: "", trainerId: "", courseId: "" });
      setEditingBatchId(null);
    } catch (error) {
      console.error("Error saving batch:", error.response?.data || error.message);
    }
  };

  // Delete Batch
  const handleDeleteBatch = async (id) => {
    try {
      await axios.delete(`${apiUrl}/admin/delete-batch/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchBatches();
    } catch (error) {
      console.error("Error deleting batch:", error.response?.data || error.message);
    }
  };

  // Edit Batch (Pre-fill input fields)
  const handleEditBatch = (batch) => {
    setNewBatch({
      batchName: batch.batchName,
      startDate: batch.startDate,
      trainerId: batch.trainerId._id,  // Store trainerId (not name)
      courseId: batch.courseId._id,    // Store courseId (not name)
    });
    setEditingBatchId(batch._id);
  };

  return (
    <div>
      <h2>Batch Management</h2>
      <input
        type="text"
        placeholder="Batch Name"
        value={newBatch.batchName}
        onChange={(e) => setNewBatch({ ...newBatch, batchName: e.target.value })}
      />
      <input
        type="date"
        placeholder="Start Date"
        value={newBatch.startDate}
        onChange={(e) => setNewBatch({ ...newBatch, startDate: e.target.value })}
      />
      <select
        value={newBatch.trainerId}
        onChange={(e) => setNewBatch({ ...newBatch, trainerId: e.target.value })}
      >
        <option value="">Select Trainer</option>
        {trainers.map((trainer) => (
          <option key={trainer._id} value={trainer._id}>
            {trainer.name}
          </option>
        ))}
      </select>
      <select
        value={newBatch.courseId}
        onChange={(e) => setNewBatch({ ...newBatch, courseId: e.target.value })}
      >
        <option value="">Select Course</option>
        {courses.map((course) => (
          <option key={course._id} value={course._id}>
            {course.name}
          </option>
        ))}
      </select>
      <button onClick={handleSaveBatch}>
        {editingBatchId ? "Save Changes" : "Add Batch"}
      </button>

      <ul>
  {batches.map((batch) => (
    <li key={batch._id}>
      {batch.batchName} - {batch.startDate} - 
      Trainer: {batch.trainerId?.name || "Unknown"} -  {/* Display trainer name */}
      Course: {batch.courseId?.name || "Unknown"} {/* Display course name */}
      <button onClick={() => handleEditBatch(batch)}>Edit</button>
      <button onClick={() => handleDeleteBatch(batch._id)}>Delete</button>
    </li>
  ))}
</ul>
    </div>
  );
};

export default BatchManagement;
