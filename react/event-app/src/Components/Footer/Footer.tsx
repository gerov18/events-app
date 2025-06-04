import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className='bg-gradient-to-r from-gray-900 to-gray-800 text-gray-300 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='space-y-2'>
          <h3 className='text-xl font-semibold text-white'>Haidi Event Inc.</h3>
          <p className='text-sm'>Bringing you closer to your passion.</p>
        </div>

        <div className='flex flex-col space-y-2 items-center md:items-end'>
          <button
            onClick={() => (window.location.href = '/organiser/login')}
            className='cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-medium transition'>
            Login as Organiser
          </button>
          <p className='text-xs'>© 2025 EventApp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
