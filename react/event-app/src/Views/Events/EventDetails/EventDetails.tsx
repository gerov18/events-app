// src/Views/Events/EventDetails/EventDetails.tsx
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../api/store';
import {
  useDeleteEventMutation,
  useGetCategoryByIdQuery,
  useGetEventByIdQuery,
  useGetEventImagesQuery,
} from '../../../api/events/eventApi';
import moment from 'moment';
import { useCreateReservationMutation } from '../../../api/reservations/reservationsApi';
import { Image } from '../../../types/Image';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const navigate = useNavigate();
  const { data: event, isLoading, isError } = useGetEventByIdQuery(Number(id));
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();
  const [reserveTickets, { isLoading: isReserving }] =
    useCreateReservationMutation();
  const { data: images, isLoading: imagesLoading } =
    useGetEventImagesQuery(eventId);

  const {
    data: category,
    isLoading: isCatLoading,
    isError: isCatError,
  } = useGetCategoryByIdQuery(event?.categoryId ?? null!);

  const auth = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isError) {
      navigate('/', { replace: true });
    }
  }, [isError, navigate]);

  if (!event) {
    return <div className='p-4'>Event not found.</div>;
  }

  if (isLoading || isCatLoading) {
    return <div className='p-4'>Loading event details…</div>;
  }

  const isOwner =
    (auth.userType === 'user' || auth.userType === 'organiser') &&
    auth.user?.id === event.createdBy;
  // const isAdmin = auth.userType === 'admin';

  const handleDelete = async () => {
    try {
      await deleteEvent(eventId).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleReserve = async () => {
    try {
      await reserveTickets(eventId).unwrap();
      alert('Билетът е резервиран успешно!');
    } catch (err: any) {
      alert(err?.data?.message || 'Грешка при резервация');
    }
  };

  return (
    <div className='p-6 max-w-3xl mx-auto'>
      <h1 className='text-3xl font-bold mb-4'>{event.title}</h1>
      <p className='text-gray-700 mb-6'>{event.description}</p>

      <div className='grid grid-cols-2 gap-4 mb-6'>
        <div>
          <strong>Date:</strong> {moment(event.date).format('DD.MM.YYYY')}
        </div>
        <div>
          <strong>Location:</strong> {event.location}
        </div>
        <div>
          <strong>Category:</strong> {category?.name}
        </div>
        <div>
          <strong>Price:</strong> ${event.price.toFixed(2)}
        </div>
        <div>
          <strong>Capacity:</strong> {event.capacity}
        </div>
        <div>
          <strong>Available:</strong> {event.availableTickets}
        </div>
      </div>
      {auth.userType !== 'organiser' && (
        <button
          onClick={handleReserve}
          disabled={isReserving || event.availableTickets < 1}
          className='px-4 py-2 bg-green-500 text-white rounded mr-4'>
          {isReserving ? 'Резервиране…' : 'Reserve ticket'}
        </button>
      )}

      <h2 className='mt-6 text-lg font-semibold'>Gallery</h2>
      {imagesLoading ? (
        <p>Loading images…</p>
      ) : images && images.length > 0 ? (
        <div className='grid grid-cols-3 gap-4 mt-4'>
          {images.map((img: Image) => (
            <img
              key={img.id}
              src={img.url}
              alt={`Event ${event.id} photo ${img.id}`}
              className='w-full h-48 object-cover rounded'
            />
          ))}
        </div>
      ) : (
        <p className='mt-2 text-gray-500'>No images uploaded yet.</p>
      )}

      {isOwner && (
        // || isAdmin
        <div className='flex space-x-4'>
          <Link
            to={`/events/${event.id}/edit`}
            className='px-4 py-2 bg-blue-500 text-white rounded'>
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`px-4 py-2 rounded text-white ${
              isDeleting ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
            }`}>
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
