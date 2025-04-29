import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaBars, FaUtensils, FaMoneyBill, FaBell, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import Sidebar from "../../components/restaurant/Sidebar";


const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f6fa;
`;


const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: #2c3e50;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid #dcdfe3;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color:rgb(212, 158, 158);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  h3 {
    color: #7f8c8d;
    font-size: 1rem;
    margin: 0 0 0.5rem 0;
  }
  
  p {
    font-size: 2rem;
    font-weight: bold;
    color: #2c3e50;
    margin: 0;
  }
`;

const OrderTable = styled.table`
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
    color: #333;
  }

  th {
    font-weight: 600;
    color: #888;
    background-color: #f9fafc;
  }

  tbody tr:hover {
    background-color: #f9f9f9;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.9rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;

  &.pending {
    background-color: #ffeaa7;
    color: #d35400;
  }

  &.preparing {
    background-color: #dfe6e9;
    color: #0984e3;
  }

  &.ready {
    background-color: #dff9fb;
    color: #00b894;
  }
`;

const Actions = styled.td`
  display: flex;
  gap: 0.75rem;
  align-items: center;

  svg {
    cursor: pointer;
    font-size: 1rem;

    &:hover {
      opacity: 0.7;
    }
  }
`;

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const mockStats = {
        totalOrders: 156,
        pendingOrders: 12,
        completedOrders: 144,
        totalRevenue: 4567.89
      };

      const mockOrders = [
        { id: 1, customer: 'User 1', items: 3, total: 45.99, status: 'pending' },
        { id: 2, customer: 'User 2', items: 2, total: 32.50, status: 'preparing' },
        { id: 3, customer: 'User 3', items: 4, total: 78.25, status: 'ready' }
      ];

      setStats(mockStats);
      setRecentOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <DashboardContainer>
       <Sidebar />

      <MainContent>
        <Header>
          <Title>Dashboard Overview</Title>
        </Header>
        
        

        <SearchInput type="text" placeholder="Search..." />

        <StatsGrid>
          <StatCard>
            <h3>Total Orders</h3>
            <p>{stats.totalOrders}</p>
          </StatCard>
          <StatCard>
            <h3>Preparing Orders</h3>
            <p>{stats.preparingOrders}</p>
          </StatCard>
          <StatCard>
            <h3>Completed Orders</h3>
            <p>{stats.completedOrders}</p>
          </StatCard>
         
        </StatsGrid>

        <OrderTable>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.items}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <StatusBadge className={order.status}>
                    {order.status}
                  </StatusBadge>
                </td>
                <Actions>
                  <FaEdit color="#3498db" />
                  <FaTrash color="#e74c3c" />
                </Actions>
              </tr>
            ))}
          </tbody>
        </OrderTable>
      </MainContent>
    </DashboardContainer>
  );
};

export default RestaurantDashboard;
