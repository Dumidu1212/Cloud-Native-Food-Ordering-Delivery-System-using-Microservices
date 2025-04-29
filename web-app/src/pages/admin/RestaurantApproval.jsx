// src/pages/admin/RestaurantApproval.jsx
import React, { useEffect, useState } from 'react';
import { fetchRestaurants, updateRestaurantStatus } from '../../services/adminApi.js';

export default function RestaurantApproval() {
  const [rests, setRests] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await fetchRestaurants();
    setRests(data.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggle = async (id, cur) => {
    await updateRestaurantStatus(id, cur==='Active'?'Inactive':'Active');
    load();
  };

  if (loading) return <p>Loading…</p>;
  return (
    <table className="table-auto w-full">
      <thead><tr><th>Name</th><th>Owner</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>
        {rests.map(r => (
          <tr key={r._id}>
            <td>{r.restaurantName}</td>
            <td>{r.restaurantOwner}</td>
            <td>{r.status}</td>
            <td>
              <button onClick={()=>toggle(r._id, r.status)}>{r.status==='Active'?'Deactivate':'Activate'}</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}