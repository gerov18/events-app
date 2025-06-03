import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Reservation } from '../../types/Reservation'; // assume this type exists
import noPicImg from '../../assets/noPic.webp';

interface ReservationCardProps {
  reservation: Reservation;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ reservation }) => {
  const { event, tickets, status } = reservation;
  const imgUrl =
    event.images && event.images.length > 0 ? event.images[0].url : noPicImg;

  return (
    <div
      className={` bg-white border ${
        status === 'CANCELLED' ? 'border-red-500 border-2' : 'border-gray-200'
      } rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col h-full`}>
      <Link
        to={`/events/${event.id}`}
        className='group block overflow-hidden'>
        <img
          className='w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300'
          src={imgUrl}
          alt={event.title}
        />
      </Link>

      <div className='p-6 flex-1 flex flex-col'>
        <Link
          to={`/events/${event.id}`}
          className='group'>
          <h5 className='mb-2 text-xl font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300'>
            {event.title}
          </h5>
        </Link>
        <p className='mb-2 text-sm font-medium text-gray-500'>
          {moment(event.date).format('DD.MM.YYYY')}
        </p>

        <p className='mb-4 flex-1 text-gray-700'>
          <span className='font-semibold'>Tickets:</span> {tickets.length}
        </p>

        <div className='mt-auto'>
          <Link
            to={`/user/${reservation.userId}/reservations/${reservation.id}`}
            className='inline-flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 transition duration-200'>
            View Details
            <svg
              className='w-4 h-4 ms-2'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 14 10'>
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M1 5h12m0 0L9 1m4 4L9 9'
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReservationCard;
