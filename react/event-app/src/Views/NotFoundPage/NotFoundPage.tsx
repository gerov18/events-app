import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <section className='flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500'>
      <div className='bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 rounded-2xl shadow-2xl p-8 max-w-md text-center'>
        <h1 className='text-8xl lg:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-400 mb-4'>
          404
        </h1>
        <p className='text-2xl lg:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2'>
          Oops! Page not found.
        </p>
        <p className='text-gray-600 dark:text-gray-300 mb-6'>
          We can’t seem to find the page you’re looking for. Go back to the
          homepage and try again.
        </p>
        <Link
          to='/'
          className='inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transform transition hover:scale-105'>
          Back to Homepage
        </Link>
      </div>
    </section>
  );
};

export default NotFoundPage;
