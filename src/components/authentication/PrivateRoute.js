import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;  // Optionally show a loading spinner
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default RequireAuth;
