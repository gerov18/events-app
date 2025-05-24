import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../api/store';

type ProtectedRouteProps = {
  allowedRoles: string[];
  children: React.ReactElement;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to='/'
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};
