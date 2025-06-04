import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export const AdminLayout: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-100'>
      <nav className='bg-white border-b'>
        <div className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Admin Panel</h1>
          <div className='space-x-4'>
            <Link
              to='/admin/users'
              className='text-gray-700 hover:underline'>
              Users
            </Link>
            <Link
              to='/admin/organisers'
              className='text-gray-700 hover:underline'>
              Organisers
            </Link>
            <Link
              to='/admin/events'
              className='text-gray-700 hover:underline'>
              Events{' '}
            </Link>
          </div>
        </div>
      </nav>
      <main className='p-6'>
        <Outlet />
      </main>
    </div>
  );
};
