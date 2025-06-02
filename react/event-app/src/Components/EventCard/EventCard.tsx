import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Event } from '../../types/Event';
import { Image } from '../../types/Image';
import noPicImg from '../../assets/noPic.webp';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const imgUrl =
    event.images && event.images.length > 0 ? event.images[0].url : noPicImg;

  const truncatedDescription = event.description.slice(0, 80) + '...';

  return (
    <div className='bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 h-full flex flex-col'>
      <Link to={`/events/${event.id}`}>
        <img
          className='w-full h-48 object-cover rounded-t-lg'
          src={imgUrl}
          alt={event.title}
        />
      </Link>

      <div className='p-5 flex-1 flex flex-col'>
        <Link
          to={`/events/${event.id}`}
          className='group'>
          <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white group-hover:text-blue-600 transition'>
            {event.title}
          </h5>
        </Link>
        <p className='mb-1 text-sm font-medium text-gray-600 dark:text-gray-400'>
          {moment(event.date).format('DD.MM.YYYY')}
        </p>

        <p className='mb-3 font-normal text-gray-700 dark:text-gray-400 flex-1 overflow-hidden'>
          {truncatedDescription}
        </p>

        <div className='mt-auto'>
          <Link
            to={`/events/${event.id}`}
            className='inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition'>
            See more
            <svg
              className='w-3.5 h-3.5 ms-2'
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

export default EventCard;
