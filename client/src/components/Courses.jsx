import React, { useState, useEffect } from "react";
import axios from "axios";

const CourseManagement = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ name: "", description: "", duration: "" });
  const [editingCourseId, setEditingCourseId] = useState(null); // Track which course is being edited

  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch Courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${apiUrl}/admin/list-courses`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCourses(response.data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error.response?.data || error.message);
    }
  };

  // Add Course
  const handleAddCourse = async () => {
    try {
      if (editingCourseId) {
        await axios.put(`${apiUrl}/admin/update-course/${editingCourseId}`, newCourse, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await axios.post(`${apiUrl}/admin/add-course`, newCourse, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      fetchCourses();
      setNewCourse({ name: "", description: "", duration: "" });
      setEditingCourseId(null); // Reset editing mode
    } catch (error) {
      console.error("Error saving course:", error.response?.data || error.message);
    }
  };

  // Delete Course
  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`${apiUrl}/admin/delete-course/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error.response?.data || error.message);
    }
  };

  // Edit Course (Pre-fill input fields)
  const handleEditCourse = (course) => {
    setNewCourse({ name: course.name, description: course.description, duration: course.duration });
    setEditingCourseId(course._id);
  };

  return (
    <div>
      <h2>Course Management</h2>
      <input
        type="text"
        placeholder="Course Name"
        value={newCourse.name}
        onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={newCourse.description}
        onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
      />
      <input
        type="text"
        placeholder="Duration"
        value={newCourse.duration}
        onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
      />
      <button onClick={handleAddCourse}>
        {editingCourseId ? "Save Changes" : "Add Course"}
      </button>

      <ul>
        {courses.map((course) => (
          <li key={course._id}>
            {course.name} - {course.description} - {course.duration}
            <button onClick={() => handleEditCourse(course)}>Edit</button>
            <button onClick={() => handleDeleteCourse(course._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseManagement;
