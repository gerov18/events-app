import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../api/store';
import { useGetMeQuery } from '../../api/me/meApi';

type ProtectedRouteProps = {
  allowedRoles: string[];
  children: React.ReactElement;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const { data, isLoading, isError } = useGetMeQuery();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return <p>Loading…</p>;
  }
  if (isError || !data || !allowedRoles.includes(data.type)) {
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
