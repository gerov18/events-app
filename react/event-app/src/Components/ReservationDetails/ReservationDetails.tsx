import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  useCancelReservationMutation,
  useGetReservationByIdQuery,
} from '../../api/reservations/reservationsApi';
import { RootState } from '../../api/store';
import moment from 'moment';
import { useGetEventByIdQuery } from '../../api/events/eventApi';

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
    if (!user || uid !== user.id) {
      //   navigate('/', { replace: true });
    }
  }, [user, uid, navigate]);

  const {
    data: reservation,
    isLoading,
    isError,
  } = useGetReservationByIdQuery({ userId: uid, reservationId: rid });

  const {
    data: event,
    isLoading: isEventLoading,
    isError: isEventError,
  } = useGetEventByIdQuery(reservation?.eventId!);

  const [cancelReservation, { isLoading: isCancelling }] =
    useCancelReservationMutation();

  useEffect(() => {
    if (isError || isEventError) {
      //   navigate('/', { replace: true });
    }
  }, [isError, navigate, isEventError]);

  if (isLoading || isEventLoading) return <div className='p-4'>Loading...</div>;
  if (!reservation || !event)
    return <div className='p-4 text-red-500'>No reservation</div>;

  const handleCancel = async () => {
    await cancelReservation(reservation.id).unwrap();
    navigate(`/users/${uid}/reservations`);
  };

  return (
    <div className='p-6 max-w-3xl mx-auto'>
      <h2 className='text-2xl font-semibold mb-4'>
        Reservation №{reservation.id}
      </h2>
      <p>
        <strong>Event:</strong> {event.title}
      </p>
      <p>
        <strong>Date:</strong> {moment(event.date).format('DD.MM.YYYY')}
      </p>
      <p>
        <strong>Location:</strong> {event.location}
      </p>
      <p>
        <strong>Status:</strong> {reservation.status}
      </p>
      <p>
        <strong>Reserved at:</strong>{' '}
        {moment(reservation.createdAt).format('DD.MM.YYYY')}
      </p>
      <button
        onClick={handleCancel}
        disabled={isCancelling || reservation.status !== 'CONFIRMED'}
        className='mt-6 px-4 py-2 bg-red-500 text-white rounded'>
        {isCancelling ? 'Cancelling…' : 'Cancel Reservation'}
      </button>
    </div>
  );
};
