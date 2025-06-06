import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../../api/store';
import { useLogoutMutation } from '../../api/auth/authApi';
import { clearUserState } from '../../api/auth/authSlice';
import { clearOrganiserState } from '../../api/organiser/organiserSlice';
import { meApi, useGetMeQuery } from '../../api/me/meApi';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { userType, user } = useSelector((state: RootState) => state.auth);
  const [logout] = useLogoutMutation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { refetch: refetchMe } = useGetMeQuery();
  console.log('aaaaa', userType);
  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearUserState());
      dispatch(clearOrganiserState());
      dispatch(meApi.util.resetApiState());
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  const hideAuthLink =
    location.pathname.includes('/login') ||
    location.pathname.includes('/register');

  return (
    <nav className='sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-20'>
          <div>
            <Link
              to='/'
              className='text-3xl font-extrabold text-white hover:text-gray-100 transition'>
              Haidi
            </Link>
          </div>

          <div className='hidden md:flex items-center space-x-6'>
            {!hideAuthLink && userType === null && (
              <Link
                to='/login'
                className='px-5 py-2 bg-white bg-opacity-25 hover:bg-opacity-50 text-lg font-medium text-gray-800 rounded-full shadow-md transform transition-all hover:scale-105'>
                Login
              </Link>
            )}

            {userType !== null && (
              <>
                <Link
                  to={
                    userType === 'organiser'
                      ? `/organiser/${(user as any).id}`
                      : '/user/me'
                  }
                  className='px-4 py-2 bg-white bg-opacity-25 hover:bg-opacity-50 text-lg font-medium text-gray-800 rounded-lg transition'>
                  Profile
                </Link>

                {userType === 'admin' && (
                  <Link
                    to='/admin'
                    className='px-4 py-2 bg-white bg-opacity-25 hover:bg-opacity-50 text-lg font-medium text-gray-800 rounded-lg transition'>
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className='px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-lg font-semibold text-white rounded-full shadow-lg transform hover:scale-105 transition duration-200 ease-in-out'>
                  Logout
                </button>
              </>
            )}
          </div>

          <div className='md:hidden flex items-center'>
            <button
              onClick={() => setMenuOpen(prev => !prev)}
              className='text-white hover:text-gray-200 focus:outline-none'>
              {menuOpen ? (
                <svg
                  className='h-8 w-8'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              ) : (
                <svg
                  className='h-8 w-8'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 8h16M4 16h16'
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden bg-indigo-700 overflow-hidden transform transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}>
        <div className='px-2 pt-2 pb-3 space-y-1'>
          {!hideAuthLink && userType === null && (
            <Link
              to='/login'
              onClick={() => setMenuOpen(false)}
              className='block px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-indigo-800 transition'>
              Login
            </Link>
          )}

          {userType !== null && (
            <>
              <Link
                to={
                  userType === 'organiser'
                    ? `/organiser/${(user as any).id}`
                    : '/user/me'
                }
                onClick={() => setMenuOpen(false)}
                className='block px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-indigo-800 transition'>
                Profile
              </Link>

              {userType === 'user' && (
                <Link
                  to={`/users/${(user as any).id}/reservations`}
                  onClick={() => setMenuOpen(false)}
                  className='block px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-indigo-800 transition'>
                  My Reservations
                </Link>
              )}

              {userType === 'admin' && (
                <Link
                  to='/admin'
                  onClick={() => setMenuOpen(false)}
                  className='block px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-indigo-800 transition'>
                  Admin Panel
                </Link>
              )}

              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className='w-full text-left px-3 py-2 rounded-lg text-base font-medium text-white hover:bg-indigo-800 transition'>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
