import React, { useState, useEffect } from "react";
import axios from "axios";

function Users() {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${apiUrl}/admin/list-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
    } catch (error) {
      alert("Error fetching users");
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${apiUrl}/admin/add-user`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      setNewUser({ name: "", email: "", password: "", role: "student" });
    } catch (error) {
      alert(error.response?.data?.message || "Error adding user");
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${apiUrl}/admin/update-user/${editUser._id}`, 
      editUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      setEditUser(null);
    } catch (error) {
      alert("Error updating user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/admin/delete-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      alert("Error deleting user");
    }
  };

  return (
    <div>
      <h2>Users</h2>

      {/* Add User Form */}
      <form onSubmit={handleAddUser}>
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          required
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="trainer">Trainer</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      {/* Edit User Form */}
      {editUser && (
        <form onSubmit={handleUpdateUser}>
          <h3>Edit User</h3>
          <input
            type="text"
            placeholder="Name"
            value={editUser.name}
            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            required
          />
          <select
            value={editUser.role}
            onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="trainer">Trainer</option>
          </select>
          <button type="submit">Update User</button>
          <button type="button" onClick={() => setEditUser(null)}>Cancel</button>
        </form>
      )}

      {/* User List */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEditUser(user)}>Edit</button>
                <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
