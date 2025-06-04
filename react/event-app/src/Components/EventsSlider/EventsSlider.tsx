import EventCard from '../EventCard/EventCard';
import { Event } from '../../types/Event';

type EventsSliderProps = {
  events: Event[];
  columns?: number;
};

const EventsSlider = ({ events, columns = 4 }: EventsSliderProps) => {
  return (
    <div
      className={`flex overflow-x-auto space-x-4 sm:grid sm:grid-cols-2 lg:grid-cols-${columns} gap-4  max-w-7xl mx-auto`}>
      {events.map((ev: Event) => (
        <div
          key={ev.id}
          className='flex-shrink-0 w-4/5 sm:w-auto'>
          <EventCard event={ev} />
        </div>
      ))}
    </div>
  );
};

export default EventsSlider;
