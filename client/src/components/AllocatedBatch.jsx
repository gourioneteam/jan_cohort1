import { useEffect, useState } from "react";
import axios from "axios";

const BatchAllocationList = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("hai1")

    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    setLoading(true);
    console.log("hai2")
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(`${apiUrl}/admin/batch-allocations`,{
        headers} );
      console.log(response)
      setAllocations(response.data.data);
    } catch (error) {
      console.error("Failed to fetch allocations", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`${apiUrl}/admin/remove-allocation/${id}`,{headers});
      fetchAllocations();
    } catch (error) {
      console.error("Failed to remove allocation", error);
    }
  };

  return (
    <div className="container">
      <h2>Batch Allocations</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Course</th>
              <th>Batch</th>
              <th>Trainer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((allocation) => (
              <tr key={allocation._id}>
                <td>{allocation.studentId?.name || "N/A"}</td>
                <td>{allocation.studentId?.email || "N/A"}</td>
                <td>{allocation.courseId?.name || "N/A"}</td>
                <td>{allocation.batchId?.batchName || "N/A"}</td>
                <td>{allocation.trainerId?.name || "N/A"}</td>
                <td>
                  <button className="remove-btn" onClick={() => handleRemove(allocation._id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BatchAllocationList;