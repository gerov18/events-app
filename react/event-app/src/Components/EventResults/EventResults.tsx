import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useGetEventsQuery } from '../../api/events/eventApi';
import EventCard from '../EventCard/EventCard';
import { Event } from '../../types/Event';

export const EventResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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
    <div className='px-4 md:px-8 lg:px-16 py-8'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-extrabold text-gray-900'>
          Search Results
        </h1>
        <button
          onClick={() => navigate(-1)}
          className='text-blue-600 hover:underline text-sm'>
          ← Back to Search
        </button>
      </div>

      {isLoading ? (
        <div className='text-center text-gray-500 mt-12'>Loading events…</div>
      ) : isError ? (
        <div className='text-center text-red-600 mt-12'>
          Error fetching events.
        </div>
      ) : !events || events.length === 0 ? (
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center'>
          <p className='text-yellow-700 font-semibold mb-2'>
            No events match your search
          </p>
          <p className='text-sm text-yellow-600'>
            Try adjusting your filters or broadening your search criteria.
          </p>
          <Link
            to='/'
            className='mt-4 inline-block text-blue-600 hover:underline'>
            Return to Home
          </Link>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
          {events.map((ev: Event) => (
            <EventCard
              key={ev.id}
              event={ev}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventResults;
