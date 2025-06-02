import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Event } from '../../types/Event';
import { Image } from '../../types/Image';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const imgUrl =
    event.images && event.images.length > 0
      ? event.images[0].url
      : '../../../public/noPic.jpg';

  const truncatedDescription = event.description.slice(0, 80) + '...';

  return (
    <div className='max-w-sm  bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700'>
      <Link to={`/events/${event.id}`}>
        <img
          className='rounded-t-lg w-full h-48 object-cover'
          src={imgUrl}
          alt={event.title}
        />
      </Link>
      <div className='p-5'>
        <Link to={`/events/${event.id}`}>
          <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            {event.title}
          </h5>
        </Link>
        <p className='mb-1 text-sm font-medium text-gray-600 dark:text-gray-400'>
          {moment(event.date).format('DD.MM.YYYY')}
        </p>
        <p className='mb-3 font-normal text-gray-700 dark:text-gray-400'>
          {truncatedDescription}
        </p>
        <Link
          to={`/events/${event.id}`}
          className='inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
          See more
          <svg
            className='rtl:rotate-180 w-3.5 h-3.5 ms-2'
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
  );
};

export default EventCard;
