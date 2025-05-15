// components/EventDetails.tsx
import React from 'react';
import { useParams } from 'react-router-dom';

const EventDetails = () => {
  const { id } = useParams();
  // Може да извлечеш данни за събитието чрез API или глобален state
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold'>Event Details for Event {id}</h1>
      {/* Тук ще добавиш повече информация за събитието */}
    </div>
  );
};

export default EventDetails;
