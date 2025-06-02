import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '../../api/store';
import { useLogoutMutation } from '../../api/auth/authApi';
import { clearUserState } from '../../api/auth/authSlice';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { userType, user } = useSelector((state: RootState) => state.auth);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUserState());
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className='sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg h-20'>
      <div className='max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-full'>
          {/* Logo / Brand */}
          <div className='flex-shrink-0 flex items-center h-full'>
            <Link
              to='/'
              className='text-3xl font-extrabold text-white hover:text-gray-100 transition'>
              Haidi
            </Link>
          </div>

          {/* Links / Buttons (Desktop) */}
          <div className='hidden md:flex items-center space-x-6'>
            {userType === null ? (
              <Link
                to='/login'
                className='px-5 py-2 text-gray-800 bg-white bg-opacity-25 hover:bg-opacity-50 text-lg font-medium rounded-full shadow-md transform transition-all hover:scale-105 hover:border-1 hover:border-black '>
                Login
              </Link>
            ) : (
              <div className='flex items-center space-x-6'>
                <Link
                  to={
                    userType === 'organiser'
                      ? `/organiser/${(user as any).id}`
                      : '/user/me'
                  }
                  className='px-4 py-2 bg-white bg-opacity-25 hover:bg-opacity-50 text-gray-800 text-lg font-medium rounded-lg transition'>
                  Profile
                </Link>

                {userType === 'user' && (
                  <Link
                    to={`/users/${(user as any).id}/reservations`}
                    className='px-4 py-2 bg-white bg-opacity-25 hover:bg-opacity-50 text-gray-800 text-lg font-medium rounded-lg transition'>
                    My Reservations
                  </Link>
                )}

                {userType === 'organiser' && (
                  <Link
                    to={`/organiser/${(user as any).id}/events`}
                    className='px-4 py-2 bg-white bg-opacity-25 hover:bg-opacity-50 text-gray-800 text-lg font-medium rounded-lg transition'>
                    My Events
                  </Link>
                )}

                {userType === 'admin' && (
                  <Link
                    to='/admin'
                    className='px-4 py-2 bg-white bg-opacity-25 hover:bg-opacity-50 text-gray-800 text-lg font-medium rounded-lg transition'>
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className='px-4 py-2 bg-red-500 hover:bg-red-600 text-gray-800 text-lg font-medium rounded-lg shadow-sm transition'>
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile “hamburger” placeholder */}
          <div className='-mr-2 flex md:hidden'>
            {/* Insert a hamburger icon here if you want a collapsible mobile menu */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
