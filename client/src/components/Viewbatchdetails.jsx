import { useEffect, useState } from "react";
import axios from "axios";

const BatchDetails = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBatchDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token"); // Assuming you store the auth token in localStorage
        const response = await axios.get(
          `${apiUrl}/student/batch-details`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          setBatches(response.data.data);
          setTotalPages(response.data.pagination.totalPages);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        setError("Failed to fetch batch details.");
      } finally {
        setLoading(false);
      }
    };

    fetchBatchDetails();
  }, [page]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">My Batch Details</h2>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {batches.length > 0 ? (
        <div className="space-y-4">
          {batches.map((batch, index) => (
            <div key={index} className="bg-white shadow-md p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Batch: {batch.batchId.batchName}</h3>
              <p>
                <strong>Course:</strong> {batch.courseId.name} - {batch.courseId.duration} days
              </p>
              <p>
                <strong>Trainer:</strong> {batch.trainerId.name} ({batch.trainerId.email})
              </p>
              <p>
                <strong>Start Date:</strong> {new Date(batch.batchId.startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>End Date:</strong> {new Date(batch.batchId.endDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {batch.batchId.status}
              </p>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="text-center">No active batch enrollments found.</p>
      )}

      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded-l disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="px-4 py-2">{page} / {totalPages}</span>
        <button
          className="px-4 py-2 bg-gray-300 rounded-r disabled:opacity-50"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BatchDetails;
