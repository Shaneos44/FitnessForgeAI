import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  requireProfileSetup?: boolean;
  children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  requireProfileSetup = true,
  children
}) => {
  const { currentUser, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If profile setup is required but not completed, redirect to profile setup
  // Type assertion workaround for Vercel type issues
  if (requireProfileSetup && !((userProfile as any)?.completedSetup)) {
    // Don't redirect if already on the profile setup page to avoid infinite loop
    if (location.pathname !== '/profile-setup') {
      return <Navigate to="/profile-setup" state={{ from: location }} replace />;
    }
  }

  // If children are provided, render them; otherwise, render <Outlet /> for nested routes
  return <>{children ? children : <Outlet />}</>;
};

export default PrivateRoute;
