import React, { useState, useEffect } from 'react';
import './RoleAssign.css'; // Assuming you have a separate CSS file for styling

// Importing Firebase database
import { db } from '../../config/firebase'; // Adjust the import path as necessary

import { getDocs, collection } from 'firebase/firestore';

const UserListPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userCollection = collection(db, "users"); // Reference to the "users" collection
        const userSnapshot = await getDocs(userCollection);
        const userList = userSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUsers(userList);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="user-list-page">
      <div className="user-header">
        <h1>User List</h1>
      </div>
      <div className="user-container">
        {users.length > 0 ? (
          <table className="user-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.full_name}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default UserListPage;
