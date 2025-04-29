import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from "../../components/restaurant/Sidebar";


// Layout wrapper
const PageWrapper = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f5f6fa;
`;

// Content section beside the sidebar
const Content = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

// Section header and filters
const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 1.6rem;
    color: #2c3e50;
  }
`;

const OrderFilters = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`;

const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background-color: ${({ active }) => (active ? '#3498db' : 'transparent')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  border: 1px solid ${({ active }) => (active ? '#3498db' : '#ccc')};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #3498db;
    color: #fff;
  }
`;

// Order list styles
const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const OrderCard = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1rem;
`;

const OrderId = styled.span`
  font-weight: 600;
  color: #3498db;
`;

const OrderStatus = styled.span`
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;

  &.pending {
    background-color: #f9ca24;
    color: white;
  }
  &.preparing {
    background-color: #2980b9;
    color: white;
  }
  &.ready {
    background-color: #00b894;
    color: white;
  }
  &.completed {
    background-color: #7f8c8d;
    color: white;
  }
`;

const OrderItems = styled.div`
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  color: #555;
`;

const OrderFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
`;

const OrderTotal = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: #2c3e50;
`;

const OrderActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.4rem 0.9rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s ease;

  &.accept {
    background-color: #2ecc71;
    color: white;
  }

  &.reject {
    background-color: #e74c3c;
    color: white;
  }

  &.complete {
    background-color: #3498db;
    color: white;
  }

  &:hover {
    opacity: 0.85;
  }
`;

const OrderManagement = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await restaurantAPI.getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await restaurantAPI.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'all') return true;
    return order.status === activeFilter;
  });

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'pending';
      case 'preparing': return 'preparing';
      case 'ready': return 'ready';
      case 'completed': return 'completed';
      default: return '';
    }
  };

  return (
    <PageWrapper>
      <Sidebar />
      <Content>
        <SectionHeader>
          <h2>Order Management</h2>
        </SectionHeader>

        <OrderFilters>
          {['all', 'pending', 'preparing', 'ready', 'completed'].map(status => (
            <FilterButton
              key={status}
              active={activeFilter === status}
              onClick={() => setActiveFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </FilterButton>
          ))}
        </OrderFilters>

        {loading ? (
          <p>Loading orders...</p>
        ) : (
          <OrdersList>
            {filteredOrders.map(order => (
              <OrderCard key={order.id}>
                <OrderHeader>
                  <OrderId>Order #{order.id}</OrderId>
                  <OrderStatus className={getStatusClass(order.status)}>
                    {order.status}
                  </OrderStatus>
                </OrderHeader>

                <OrderItems>
                  {order.items.map(item => (
                    <OrderItem key={item.id}>
                      <span>{item.name} x {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </OrderItem>
                  ))}
                </OrderItems>

                <OrderFooter>
                  <OrderTotal>Total: ${order.total.toFixed(2)}</OrderTotal>
                  <OrderActions>
                    {order.status === 'pending' && (
                      <>
                        <ActionButton
                          className="accept"
                          onClick={() => handleStatusUpdate(order.id, 'preparing')}
                        >
                          Accept
                        </ActionButton>
                        <ActionButton
                          className="reject"
                          onClick={() => handleStatusUpdate(order.id, 'rejected')}
                        >
                          Reject
                        </ActionButton>
                      </>
                    )}
                    {order.status === 'preparing' && (
                      <ActionButton
                        className="complete"
                        onClick={() => handleStatusUpdate(order.id, 'ready')}
                      >
                        Mark as Ready
                      </ActionButton>
                    )}
                    {order.status === 'ready' && (
                      <ActionButton
                        className="complete"
                        onClick={() => handleStatusUpdate(order.id, 'completed')}
                      >
                        Complete Order
                      </ActionButton>
                    )}
                  </OrderActions>
                </OrderFooter>
              </OrderCard>
            ))}
          </OrdersList>
        )}
      </Content>
    </PageWrapper>
  );
};

export default OrderManagement;
