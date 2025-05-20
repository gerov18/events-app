import React from 'react';
import { useParams } from 'react-router-dom';

const EventDetails = () => {
  const { id } = useParams();
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold'>Event Details for Event {id}</h1>
    </div>
  );
};

export default EventDetails;
