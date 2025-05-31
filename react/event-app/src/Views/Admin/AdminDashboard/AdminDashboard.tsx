import React from 'react';
import { Outlet } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-100'>
      <Outlet />
    </div>
  );
};
