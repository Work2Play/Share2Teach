import React, { useState, useEffect } from 'react';
import './RoleAssign.css'; // Assuming you have a separate CSS file for styling

// Importing Firebase database
import { db } from '../../config/firebase'; // Adjust the import path as necessary
import { getDocs, collection, doc, updateDoc } from 'firebase/firestore';

const RoleAssignPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modifiedUsers, setModifiedUsers] = useState({}); // Track modified roles
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      try {
        const userCollection = collection(db, "users"); // Reference to the "users" collection
        const userSnapshot = await getDocs(userCollection);
        const userList = userSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const roleList = userList.map((user) => user.role);
        const uniqueRoles = [...new Set(roleList)];

        setUsers(userList);
        setRoles(uniqueRoles);
      } catch (err) {
        console.error("Error fetching users and roles:", err);
      }
    };

    fetchUsersAndRoles();
  }, []);

  const handleRoleChange = (userId, newRole) => {
    setModifiedUsers((prev) => ({
      ...prev,
      [userId]: newRole,
    }));
  };

  const handleSaveClick = async (userId) => {
    try {
      const newRole = modifiedUsers[userId];
      const userDocRef = doc(db, "users", userId);

      await updateDoc(userDocRef, { role: newRole });  // Update the user's role in Firebase
      console.log(`Role updated for user ID: ${userId} to ${newRole}`);
      
      // Clear the modified state after saving
      setModifiedUsers((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="user-list-page">
      <div className="user-header">
        <h1>User List</h1>
        <input
          type="text"
          placeholder="Search by email or name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="user-container">
        {filteredUsers.length > 0 ? (
          <table className="user-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isModified = modifiedUsers[user.id] !== undefined;
                return (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>{user.full_name}</td>
                    <td>
                      <select
                        value={modifiedUsers[user.id] || user.role}
                        className="role-dropdown"
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      >
                        {roles.map((role, index) => (
                          <option key={index} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className={`save-button ${isModified ? 'active' : ''}`}
                        disabled={!isModified}
                        onClick={() => handleSaveClick(user.id)}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default RoleAssignPage;
