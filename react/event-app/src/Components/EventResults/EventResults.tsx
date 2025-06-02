import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useGetEventsQuery } from '../../api/events/eventApi';
import EventCard from '../EventCard/EventCard';
import FilterBar from '../FilterBar/FilterBar';
import { Event } from '../../types/Event';

const EventResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const keywordParam = searchParams.get('keyword') || undefined;
  const cityParam = searchParams.get('city') || undefined;
  const categoryParam = searchParams.get('categoryId');
  const dateFromParam = searchParams.get('dateFrom') || undefined;
  const dateToParam = searchParams.get('dateTo') || undefined;

  const categoryId =
    categoryParam && !isNaN(Number(categoryParam))
      ? Number(categoryParam)
      : undefined;

  const {
    data: events,
    isLoading,
    isError,
  } = useGetEventsQuery({
    keyword:
      keywordParam && keywordParam.trim() !== '' ? keywordParam : undefined,
    city: cityParam && cityParam.trim() !== '' ? cityParam : undefined,
    categoryId,
    dateFrom: dateFromParam,
    dateTo: dateToParam,
    take: undefined,
  });

  return (
    <div className='min-h-screen py-10 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto'>
      <div className='flex justify-start'>
        <button
          onClick={() => navigate(-1)}
          className='flex items-center text-blue-600 hover:text-blue-800 transition text-xl font-medium'>
          ← Back to Search
        </button>
      </div>
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-3xl lg:text-4xl font-extrabold text-gray-900'>
          Search Results:
        </h1>
        <div className='space-x-4'>
          <button
            onClick={() => setShowFilters(prev => !prev)}
            className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition'>
            Filters
          </button>
        </div>
      </div>

      {showFilters && <FilterBar />}

      {isLoading ? (
        <div className='text-center text-gray-500 mt-12 text-lg'>
          Loading events…
        </div>
      ) : isError ? (
        <div className='text-center text-red-600 mt-12 text-lg'>
          Error fetching events.
        </div>
      ) : !events || events.length === 0 ? (
        <div className='max-w-md mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center shadow-sm'>
          <p className='text-yellow-700 font-semibold text-xl mb-2'>
            No events match your search
          </p>
          <p className='text-sm text-yellow-600 mb-4'>
            Try adjusting your filters or broadening your search criteria.
          </p>
          <Link
            to='/'
            className='inline-block px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition'>
            Return to Home
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
          {events.map((ev: Event) => (
            <div
              key={ev.id}
              className='transform hover:scale-105 transition duration-300'>
              <EventCard event={ev} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventResults;
