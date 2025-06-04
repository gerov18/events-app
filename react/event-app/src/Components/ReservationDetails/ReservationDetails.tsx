import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  useCancelReservationMutation,
  useGetReservationByIdQuery,
} from '../../api/reservations/reservationsApi';
import { useGetEventByIdQuery } from '../../api/events/eventApi';
import { RootState } from '../../api/store';
import moment from 'moment';
import TicketCard from '../../Components/TicketCard/TicketCard';

export const ReservationDetails: React.FC = () => {
  const navigate = useNavigate();
  const { userType, user } = useSelector((s: RootState) => s.auth);

  const { userId, reservationId } = useParams<{
    userId: string;
    reservationId: string;
  }>();
  const uid = Number(userId);
  const rid = Number(reservationId);

  useEffect(() => {
    if (user && uid !== user.id) {
      navigate('/', { replace: true });
    }
  }, [user, uid, navigate]);

  const {
    data: reservation,
    isLoading: isResLoading,
    isError: isResError,
  } = useGetReservationByIdQuery({ userId: uid, reservationId: rid });
  const {
    data: event,
    isLoading: isEvtLoading,
    isError: isEvtError,
  } = useGetEventByIdQuery(reservation?.eventId ?? 0, {
    skip: !reservation,
  });

  const [cancelReservation, { isLoading: isCancelling }] =
    useCancelReservationMutation();

  useEffect(() => {
    if (isResError || isEvtError) {
      navigate('/', { replace: true });
    }
  }, [isResError, isEvtError, navigate]);

  if (isResLoading || isEvtLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-gray-500 text-lg'>Loading reservation…</p>
      </div>
    );
  }
  if (!reservation || !event) {
    return (
      <div className='flex justify-center items-center h-64'>
        <p className='text-red-500 text-lg'>No reservation found.</p>
      </div>
    );
  }

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }
    await cancelReservation({ resId: reservation.id, userId: uid }).unwrap();
    navigate(`/user/me`);
  };

  return (
    <div className='px-4 py-8 max-w-3xl mx-auto space-y-8'>
      <div className='bg-white rounded-2xl shadow-lg p-8'>
        <h2 className='text-3xl font-extrabold text-gray-900 mb-6 text-center'>
          Reservation №{reservation.id}
        </h2>

        <div className='grid grid-cols-1 gap-6 mb-8'>
          <div className='bg-gray-50 rounded-lg p-6'>
            <p className='text-gray-700 mb-2'>
              <strong>Event:</strong> {event.title}
            </p>
            <p className='text-gray-700 mb-2'>
              <strong>Date:</strong> {moment(event.date).format('DD.MM.YYYY')}
            </p>
            <p className='text-gray-700 mb-2'>
              <strong>Location:</strong> {event.location}
            </p>
            <p className='text-gray-700 mb-2'>
              <strong>Status:</strong>{' '}
              <span
                className={`px-2 py-1 inline-block rounded-full ${
                  reservation.status === 'CONFIRMED'
                    ? 'bg-green-100 text-green-800'
                    : reservation.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                {reservation.status}
              </span>
            </p>
            <p className='text-gray-700'>
              <strong>Reserved On:</strong>{' '}
              {moment(reservation.createdAt).format('DD.MM.YYYY')}
            </p>
          </div>

          <div>
            <h3 className='text-2xl font-semibold text-gray-800 mb-4 text-center'>
              Your Tickets
            </h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
              {reservation.tickets.map(ticket => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  eventTitle={event.title}
                  eventDate={event.date}
                  eventLocation={event.location}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleCancel}
          disabled={isCancelling || reservation.status !== 'CONFIRMED'}
          className='w-full px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition disabled:opacity-50 font-medium'>
          {isCancelling ? 'Cancelling…' : 'Cancel Reservation'}
        </button>
      </div>
    </div>
  );
};

export default ReservationDetails;
