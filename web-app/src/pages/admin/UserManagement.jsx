// src/pages/admin/UserManagement.jsx
import React, { useEffect, useState } from 'react';
import { fetchUsers, updateUserStatus, approveUser, deleteUser } from '../../services/adminApi.js';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await fetchUsers();
    setUsers(data.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const onApprove = async id => { await approveUser(id); load(); };
  const onToggle = async (id, current) => { await updateUserStatus(id, current==='Active'?'Inactive':'Active'); load(); };
  const onDelete = async id => { if(window.confirm('Delete?')) { await deleteUser(id); load(); }};

  if (loading) return <p>Loading users…</p>;
  return (
    <table className="table-auto w-full">
      <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>
        {users.map(u => (
          <tr key={u._id}>
            <td>{u.name}</td>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td>{u.status}</td>
            <td className="space-x-2">
              {u.status==='Pending' && <button onClick={()=>onApprove(u._id)}>Approve</button>}
              <button onClick={()=>onToggle(u._id,u.status)}>{u.status==='Active'?'Block':'Unblock'}</button>
              <button onClick={()=>onDelete(u._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}