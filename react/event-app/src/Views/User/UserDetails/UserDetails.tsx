import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { RootState } from '../../../api/store';
import { useGetMeQuery } from '../../../api/me/meApi';
import {
  useCancelReservationMutation,
  useGetUserReservationsQuery,
} from '../../../api/reservations/reservationsApi';

export const UserDetails: React.FC = () => {
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const userType = auth.userType;
  const user = auth.user;
  const userId = user?.id ?? null;

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
    return <div className='p-4'>Loading your profile...</div>;
  }

  if (!meData || meData.type === 'organiser') {
    navigate('/');
    return <div className='p-4 text-red-500'>No user details found</div>;
  }

  const handleCancel = async (reservationId: number) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }
    try {
      await cancelReservation(reservationId).unwrap();
    } catch (err: any) {
      console.error(err);
      alert(err.data?.message || 'Cancellation failed');
    }
  };

  return (
    <div className='p-6 max-w-3xl mx-auto'>
      <h1 className='text-3xl font-bold mb-4'>Your Profile</h1>
      <div className='mb-6'>
        <p>
          <strong>Name:</strong> {meData.data.firstName} {meData.data.lastName}
        </p>
        <p>
          <strong>Username:</strong> {meData.data.username}
        </p>
        <p>
          <strong>Email:</strong> {meData.data.email}
        </p>
        <div className='mt-4 space-x-4'>
          <Link
            to='/user/me/edit'
            className='px-4 py-2 bg-blue-500 text-white rounded'>
            Edit Profile
          </Link>
          <Link
            to='/user/me/delete'
            className='px-4 py-2 bg-red-500 text-white rounded'>
            Delete Account
          </Link>
        </div>
      </div>

      <h2 className='text-2xl font-semibold mb-3'>Your Reservations</h2>
      {isResError ? (
        <p className='text-red-500'>Error loading reservations.</p>
      ) : reservations && reservations.length === 0 ? (
        <p className='text-gray-600'>You have no reservations yet.</p>
      ) : (
        <table className='w-full border-collapse'>
          <thead>
            <tr className='border-b'>
              <th className='py-2 text-left'>#</th>
              <th className='py-2 text-left'>Event</th>
              <th className='py-2 text-left'>Date</th>
              <th className='py-2 text-left'>Status</th>
              <th className='py-2 text-left'>Reserved On</th>
              <th className='py-2 text-left'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations?.map(res => (
              <tr
                key={res.id}
                className='border-b'>
                <td className='py-2'>{res.id}</td>
                <td className='py-2'>
                  <Link
                    to={`/events/${res.eventId}`}
                    className='text-blue-600 hover:underline'>
                    {res.event.title}
                  </Link>
                </td>
                <td className='py-2'>
                  {moment(res.event.date).format('DD.MM.YYYY')}
                </td>
                <td className='py-2'>
                  <span
                    className={`px-2 inline-block rounded ${
                      res.status === 'CONFIRMED'
                        ? 'bg-green-100 text-green-800'
                        : res.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {res.status}
                  </span>
                </td>
                <td className='py-2'>
                  {moment(res.createdAt).format('DD.MM.YYYY')}
                </td>
                <td className='py-2 space-x-2'>
                  <Link
                    to={`/user/${meData.data.id}/reservations/${res.id}`}
                    className='px-2 py-1 bg-blue-500 text-white rounded text-sm'>
                    View
                  </Link>
                  {res.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleCancel(res.id)}
                      disabled={isCancelling}
                      className='px-2 py-1 bg-red-500 text-white rounded text-sm'>
                      {isCancelling ? 'Cancelling…' : 'Cancel'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
