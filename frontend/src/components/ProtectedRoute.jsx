// src/components/ProtectedRoute.jsx - Redirect to login if not authenticated

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show nothing while verifying token
  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
