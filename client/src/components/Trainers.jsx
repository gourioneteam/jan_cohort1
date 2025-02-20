import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Trainers() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [trainers, setTrainers] = useState([]);
  const [newTrainer, setNewTrainer] = useState({ name: '', subject: '', email: '' });
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrainers();
  }, []);

  // Fetch trainers from the API
  const fetchTrainers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${apiUrl}/admin/list-users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTrainers(response.data.users); // Ensure this matches API response structure
    } catch (err) {
      setError('Failed to fetch trainers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new trainer
  const handleAddTrainer = async (e) => {
    e.preventDefault();
    setError('');

    if (!newTrainer.name || !newTrainer.subject || !newTrainer.email) {
      setError('All fields are required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${apiUrl}/admin/add-user`, newTrainer, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTrainers();
      setNewTrainer({ name: '', subject: '', email: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding trainer');
    }
  };

  // Edit a trainer
  const handleEditTrainer = (trainer) => {
    setEditingTrainer(trainer);
    setNewTrainer({ name: trainer.name, subject: trainer.subject, email: trainer.email });
  };

  // Update trainer details
  const handleUpdateTrainer = async () => {
    if (!editingTrainer) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`${apiUrl}/admin/update-user/${editingTrainer._id}`, newTrainer, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingTrainer(null);
      setNewTrainer({ name: '', subject: '', email: '' });
      fetchTrainers();
    } catch (err) {
      setError('Error updating trainer');
    }
  };

  // Delete a trainer
  const handleDeleteTrainer = async (trainerId) => {
    if (!window.confirm('Are you sure you want to delete this trainer?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${apiUrl}/admin/delete-user/${trainerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTrainers();
    } catch (err) {
      setError('Error deleting trainer');
    }
  };

  return (
    <div>
      <h2>Trainers</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={editingTrainer ? handleUpdateTrainer : handleAddTrainer} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Name"
          value={newTrainer.name}
          onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Subject"
          value={newTrainer.subject}
          onChange={(e) => setNewTrainer({ ...newTrainer, subject: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newTrainer.email}
          onChange={(e) => setNewTrainer({ ...newTrainer, email: e.target.value })}
          required
        />
        <button type="submit">{editingTrainer ? 'Update Trainer' : 'Add Trainer'}</button>
        {editingTrainer && <button onClick={() => setEditingTrainer(null)}>Cancel</button>}
      </form>

      {loading ? (
        <p>Loading trainers...</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Subject</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainers.length > 0 ? (
              trainers.map((trainer) => (
                <tr key={trainer._id}>
                  <td>{trainer.name}</td>
                  <td>{trainer.subject}</td>
                  <td>{trainer.email}</td>
                  <td>
                    <button onClick={() => handleEditTrainer(trainer)}>Edit</button>
                    <button onClick={() => handleDeleteTrainer(trainer._id)} style={{ marginLeft: '5px' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No trainers available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Trainers;
