import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../api/store';
import { useGetMeQuery } from '../../../api/me/meApi';
import {
  useGetUserReservationsQuery,
  useCancelReservationMutation,
} from '../../../api/reservations/reservationsApi';
import ReservationCard from '../../../Components/ReservationCard/ReservationCard';

export const UserDetails: React.FC = () => {
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const userType = auth.userType;
  const user = auth.user;
  const userId = user?.id ?? null;
  console.log('userId', userId);
  const {
    data: meData,
    isLoading: isMeLoading,
    isError: isMeError,
  } = useGetMeQuery();

  const {
    data: reservations,
    isLoading: isResLoading,
    isError: isResError,
  } = useGetUserReservationsQuery(userId!, {
    skip: userId === null,
  });

  const [cancelReservation, { isLoading: isCancelling }] =
    useCancelReservationMutation();

  useEffect(() => {
    if (!isMeLoading && (isMeError || !meData)) {
      navigate('/login', { replace: true });
    }
  }, [isMeLoading, isMeError, meData, navigate]);

  if (isMeLoading || isResLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-gray-500 text-lg'>Loading your profile...</p>
      </div>
    );
  }

  if (!meData || meData.type === 'organiser') {
    navigate('/');
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-red-500 text-lg'>No user details found</p>
      </div>
    );
  }

  const handleCancel = async (id: number, reservationId: number) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }
    try {
      await cancelReservation({
        userId: id,
        resId: reservationId,
      }).unwrap();
    } catch (err: any) {
      console.error(err);
      alert(err.data?.message || 'Cancellation failed');
    }
  };

  if (!userId || userId === null) {
    navigate('/404');

    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-red-500 text-lg'>No user details found</p>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto mt-12 mb-16 px-6'>
      <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
        <div className='bg-gradient-to-r from-indigo-600 to-blue-500 p-8 text-white text-center'>
          <h1 className='text-4xl font-extrabold drop-shadow-lg'>
            {meData.data.firstName} {meData.data.lastName}
          </h1>
          <p className='mt-2 text-lg opacity-90'>{meData.data.username}</p>
        </div>
        <div className='p-6 grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <p className='text-gray-700 mb-2'>
              <strong>Email:</strong>{' '}
              <span className='text-indigo-600'>{meData.data.email}</span>
            </p>
          </div>
          <div className='flex justify-center items-center space-x-4'>
            <Link
              to='/user/me/edit'
              className='px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition'>
              Edit Profile
            </Link>
            <Link
              to='/user/me/delete'
              className='px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition'>
              Delete Account
            </Link>
          </div>
        </div>
      </div>

      <div className='mt-12'>
        <h2 className='text-3xl font-bold text-gray-800 mb-6 text-center'>
          Your Reservations
        </h2>
        {isResError ? (
          <p className='text-center text-red-500'>
            Error loading reservations.
          </p>
        ) : reservations && reservations.length === 0 ? (
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center shadow-sm'>
            <p className='text-yellow-700 font-semibold mb-2'>
              No reservations yet
            </p>
            <p className='text-sm text-yellow-600'>
              You haven’t reserved any events yet.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {reservations?.map(res => (
              <div
                key={res.id}
                className='space-y-4'>
                <ReservationCard reservation={res} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
