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
    <nav className='bg-blue-600 text-white px-4 py-2 flex justify-between items-center'>
      <div className='text-xl font-semibold'>
        <Link to='/'>EventApp</Link>
      </div>

      <div className='space-x-4'>
        {userType === null ? (
          <Link
            to='/login'
            className='hover:underline px-3 py-1 rounded bg-blue-500 hover:bg-blue-700'>
            Login
          </Link>
        ) : (
          <div className='flex items-center space-x-4'>
            <Link
              to={
                userType === 'organiser'
                  ? `/organiser/${(user as any).id}`
                  : '/user/me'
              }
              className='hover:underline px-3 py-1 rounded bg-blue-500 hover:bg-blue-700'>
              Profile
            </Link>

            {userType === 'user' && (
              <Link
                to={`/users/${(user as any).id}/reservations`}
                className='hover:underline px-3 py-1 rounded bg-blue-500 hover:bg-blue-700'>
                My Reservations
              </Link>
            )}

            {userType === 'organiser' && (
              <Link
                to={`/organiser/${(user as any).id}/events`}
                className='hover:underline px-3 py-1 rounded bg-blue-500 hover:bg-blue-700'>
                My Events
              </Link>
            )}

            {userType === 'admin' && (
              <Link
                to='/admin'
                className='hover:underline px-3 py-1 rounded bg-blue-500 hover:bg-blue-700'>
                Admin Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              className='hover:underline px-3 py-1 rounded bg-red-500 hover:bg-red-700'>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
