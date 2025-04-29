import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaBell, FaMoneyBill, FaUsers, FaSignOutAlt, FaUtensils } from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: 250px;
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #e74c3c;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
`;

const MenuItem = styled.li`
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #2c3e50;
  gap: 0.75rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f0f4f8;
  }

  &.active {
    background-color: hsl(0, 100%, 89.6%);
    color: #e60000;
  }
`;

const LogoutButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background-color: #c0392b;
  }
`;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <FaBars /> },
    { label: 'Orders', path: '/orders', icon: <FaBell /> },
    { label: 'Menu', path: '/menu', icon: <FaMoneyBill /> },
    { label: 'Profile', path: '/profile', icon: <FaUsers /> }
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <SidebarContainer>
      <div>
        <Logo><FaUtensils /> Dashboard</Logo>
        <MenuList>
          {menuItems.map((item) => (
            <MenuItem
              key={item.path}
              className={location.pathname === item.path ? 'active' : ''}
              onClick={() => navigate(item.path)}
            >
              {item.icon} {item.label}
            </MenuItem>
          ))}
        </MenuList>
      </div>
      <LogoutButton onClick={handleLogout}><FaSignOutAlt /> Logout</LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;
