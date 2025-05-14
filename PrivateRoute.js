import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/products" />;
  }

  return children;
};

export default PrivateRoute; 