import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { RootState } from '../../../api/store';

import {
  useGetUserReservationsQuery,
  useCancelReservationMutation,
} from '../../../api/reservations/reservationsApi';
import ReservationCard from '../../../Components/ReservationCard/ReservationCard';
import { ProtectedRoute } from '../../../Components/ProtectedRoute/ProtectedRoute';
import {
  useDeleteUserMutation,
  useGetUserByIdQuery,
} from '../../../api/admin/userApi';

const AdminUserDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);

  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useGetUserByIdQuery(userId);

  const {
    data: reservations,
    isLoading: isResLoading,
    isError: isResError,
  } = useGetUserReservationsQuery(userId, {
    skip: userId == null,
  });

  const [deleteUser, { isLoading: isDeleting, isSuccess: deleteSuccess }] =
    useDeleteUserMutation();

  const [cancelReservation, { isLoading: isCancelling }] =
    useCancelReservationMutation();

  useEffect(() => {
    if (!isUserLoading && isUserError) {
      navigate('/admin/users', { replace: true });
    }
  }, [isUserLoading, isUserError, navigate]);

  if (isUserLoading || isResLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-gray-500 text-lg'>Loading…</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-red-500 text-lg'>User not found.</p>
      </div>
    );
  }

  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    try {
      await deleteUser(userId).unwrap();
      navigate('/admin/users', { replace: true });
    } catch (err) {
      console.error('Delete user failed:', err);
      alert((err as any).data?.message || 'Could not delete user');
    }
  };

  const handleCancelReservation = async (reservationId: number) => {
    if (!window.confirm('Cancel this reservation?')) {
      return;
    }
    try {
      await cancelReservation({ userId, resId: reservationId }).unwrap();
    } catch (err) {
      console.error('Cancel reservation failed:', err);
      alert((err as any).data?.message || 'Could not cancel reservation');
    }
  };

  return (
    <div className='px-4 py-8 max-w-4xl mx-auto space-y-8'>
      <div className='bg-white rounded-2xl shadow-lg p-8'>
        <h1 className='text-3xl font-extrabold text-gray-900 mb-6 text-center'>
          User Profile (ID #{userData.id})
        </h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <div>
            <p className='text-gray-700 mb-2'>
              <span className='font-semibold'>Name:</span> {userData.firstName}{' '}
              {userData.lastName}
            </p>
            <p className='text-gray-700 mb-2'>
              <span className='font-semibold'>Username:</span>{' '}
              {userData.username}
            </p>
            <p className='text-gray-700 mb-2'>
              <span className='font-semibold'>Email:</span> {userData.email}
            </p>
            <p className='text-gray-700'>
              <span className='font-semibold'>Joined:</span>{' '}
              {moment(userData.createdAt).format('DD MMM YYYY')}
            </p>
          </div>
          <div className='flex flex-col items-center justify-center space-y-4'>
            <Link
              to={`/admin/users/${userData.id}/edit`}
              className='w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium'>
              Edit User
            </Link>
            <button
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className={`w-full text-center px-4 py-2 ${
                isDeleting
                  ? 'bg-gray-300 text-gray-600'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              } rounded-lg transition font-medium`}>
              {isDeleting ? 'Deleting…' : 'Delete User'}
            </button>
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        <h2 className='text-2xl font-semibold text-gray-800'>
          User Reservations
        </h2>
        {isResError ? (
          <p className='text-red-500'>Error loading reservations.</p>
        ) : reservations && reservations.length === 0 ? (
          <p className='text-gray-600'>This user has no reservations.</p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {reservations?.map(res => (
              <div
                key={res.id}
                className='space-y-2'>
                <ReservationCard reservation={res} />
                {res.status === 'CONFIRMED' && (
                  <button
                    onClick={() => handleCancelReservation(res.id)}
                    disabled={isCancelling}
                    className='mt-2 w-full text-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm font-medium'>
                    {isCancelling ? 'Cancelling…' : 'Cancel Reservation'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default () => (
  <ProtectedRoute allowedRoles={['admin']}>
    <AdminUserDetails />
  </ProtectedRoute>
);
