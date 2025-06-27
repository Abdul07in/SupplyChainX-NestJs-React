import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/queries/useAuth';
import LoadingFallback from './LoadingFallback';
import { ProtectedRouteProps } from '../../interfaces/common/ProtectedRouteProps';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoadingUser } = useAuth();

  if (isLoadingUser) {
    return <LoadingFallback message='Checking authentication...' />;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
