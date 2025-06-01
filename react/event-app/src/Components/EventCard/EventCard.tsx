import { Link } from 'react-router-dom';
import styles from './EventCard.module.css';
import { Event } from '../../types/Event';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const { id, title, date, images } = event;
  return (
    <Link to={`/events/${id}`}>
      <div
        className={
          'flex border-2 border-black flex-col justify-center align-middle '
        }>
        {images && <img src={event.images[0].url} />}
        <h3>{title}</h3>
        <p>{date}</p>
      </div>
    </Link>
  );
};

export default EventCard;
