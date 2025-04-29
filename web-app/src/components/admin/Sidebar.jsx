// src/components/admin/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUsers, FaUtensils, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import '../../styles/pages/adminPanel.css'

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout } = useAuth();

  const menu = [
    { label: 'Users', path: '/admin/users', icon: <FaUsers /> },
    { label: 'Restaurants', path: '/admin/restaurants', icon: <FaUtensils /> },
    { label: 'Financials', path: '/admin/financials', icon: <FaChartBar /> }
  ];

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">FoodApp</div>
      <ul className="sidebar-menu">
        {menu.map(item => (
          <li
            key={item.path}
            className={`sidebar-menu-item${pathname.startsWith(item.path) ? ' active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span className="menu-label">{item.label}</span>
          </li>
        ))}
      </ul>
      <button className="sidebar-logout" onClick={() => { logout(); navigate('/login'); }}>
        <FaSignOutAlt />
        <span className="menu-label">Logout</span>
      </button>
    </div>
  );
}