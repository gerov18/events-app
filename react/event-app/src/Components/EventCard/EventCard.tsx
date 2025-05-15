import { Link } from 'react-router-dom';
import styles from './EventCard.module.css';
import { Event } from '../../types/event';

const EventCard = (event: Event) => {
  const { title, date, id } = event;
  return (
    <Link to={`/events/${id}`}>
      <div className={styles.eventCard}>
        <img />
        <h3>{title}</h3>
        <p>{date}</p>
      </div>
    </Link>
  );
};

export default EventCard;
