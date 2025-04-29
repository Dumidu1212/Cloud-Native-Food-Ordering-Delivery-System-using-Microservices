// src/pages/admin/Dashboard.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar.jsx';

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <Sidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}