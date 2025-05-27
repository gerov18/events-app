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
import { QRCodeSVG } from 'qrcode.react';

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
    return <div className='p-4'>Loading…</div>;
  }
  if (!reservation || !event) {
    return <div className='p-4 text-red-500'>No reservation found.</div>;
  }

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }
    await cancelReservation(reservation.id).unwrap();
    navigate(`/users/${uid}/reservations`);
  };

  return (
    <div className='p-6 max-w-3xl mx-auto space-y-4'>
      <h2 className='text-2xl font-semibold'>Reservation №{reservation.id}</h2>

      <div className='space-y-1'>
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
          <strong>Reserved on:</strong>{' '}
          {moment(reservation.createdAt).format('DD.MM.YYYY')}
        </p>
      </div>

      <div>
        <h3 className='text-xl font-medium'>Tickets</h3>
        <ul className='list-disc pl-5 space-y-1'>
          {reservation.tickets.map(ticket => (
            <li
              key={ticket.id}
              className='flex items-center space-x-2'>
              <span>Ticket #{ticket.id}</span>
              <span className='px-2 py-1 text-sm bg-gray-200 rounded'>
                {ticket.status}
              </span>
              {ticket.qrCode && (
                <QRCodeSVG
                  value={ticket.qrCode}
                  width={128}
                />
              )}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleCancel}
        disabled={isCancelling || reservation.status !== 'CONFIRMED'}
        className='mt-6 px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50'>
        {isCancelling ? 'Cancelling…' : 'Cancel Reservation'}
      </button>
    </div>
  );
};
