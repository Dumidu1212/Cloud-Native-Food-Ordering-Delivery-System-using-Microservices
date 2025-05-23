import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function RequireAuth({ roles = [], children }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
}
