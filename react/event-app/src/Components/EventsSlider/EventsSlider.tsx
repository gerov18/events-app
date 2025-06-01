import EventCard from '../EventCard/EventCard';
import { Event } from '../../types/Event';

type EventsSliderProps = {
  events: Event[];
};

const EventsSlider = ({ events }: EventsSliderProps) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
      {events.map(evt => (
        <EventCard
          key={evt.id}
          event={evt}
        />
      ))}
    </div>
  );
};

export default EventsSlider;
