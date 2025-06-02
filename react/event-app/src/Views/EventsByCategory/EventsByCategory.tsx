import { Navigate, useParams } from 'react-router';
import {
  useGetCategoryByIdQuery,
  useGetEventsQuery,
} from '../../api/events/eventApi';
import EventsSlider from '../../Components/EventsSlider/EventsSlider';

const EventsByCategory = () => {
  const { id } = useParams<{ id: string }>();
  const {
    data: category,
    isLoading: isCatLoading,
    isError: isCatError,
  } = useGetCategoryByIdQuery(Number(id));
  const {
    data: events,
    isLoading,
    isError,
  } = useGetEventsQuery({ categoryId: Number(id) });

  if (isLoading || isCatLoading) {
    return <h5>Loading events...</h5>;
  }

  if (!category) {
    return (
      <Navigate
        to='*'
        replace
      />
    );
  }

  if (isError) {
    return <h5>Error loading events</h5>;
  }
  return (
    <>
      {!events || events.length === 0 ? (
        <h5>No events found</h5>
      ) : (
        <EventsSlider events={events} />
      )}
    </>
  );
};

export default EventsByCategory;
