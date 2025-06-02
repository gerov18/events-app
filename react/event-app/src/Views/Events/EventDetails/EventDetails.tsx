import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import moment from 'moment';
import {
  useGetEventByIdQuery,
  useDeleteEventMutation,
  useGetEventImagesQuery,
  useGetCategoryByIdQuery,
} from '../../../api/events/eventApi';
import { useCreateReservationMutation } from '../../../api/reservations/reservationsApi';

import { MapDisplay } from '../../../Components/MapDisplay/MapDisplay';
import { RootState } from '../../../api/store';
import { Image } from '../../../types/Image';

interface GeocodeResponse {
  features: Array<{ center: [number, number] }>;
}

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const eventId = Number(id);
  const navigate = useNavigate();

  const { data: event, isLoading, isError } = useGetEventByIdQuery(eventId);
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();
  const [reserveTickets, { isLoading: isReserving }] =
    useCreateReservationMutation();
  const { data: images, isLoading: imagesLoading } =
    useGetEventImagesQuery(eventId);
  const { data: category, isLoading: isCatLoading } = useGetCategoryByIdQuery(
    event?.categoryId ?? 0
  );
  const auth = useSelector((state: RootState) => state.auth);

  const [quantity, setQuantity] = useState<number>(1);

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  useEffect(() => {
    if (event?.location) {
      const encoded = encodeURIComponent(event.location);
      const url =
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?` +
        `access_token=${MAPBOX_TOKEN}&limit=1&language=en`;

      fetch(url)
        .then(async res => {
          if (!res.ok) throw new Error('Mapbox geocode failed');
          const data = (await res.json()) as GeocodeResponse;
          if (data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            setCoords({ lat, lng });
          }
        })
        .catch(e => console.error('Geocode error:', e));
    }
  }, [event?.location, MAPBOX_TOKEN]);

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

  const handleDelete = async () => {
    try {
      await deleteEvent(eventId).unwrap();
      navigate('/');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleReserve = () => {
    navigate(`/checkout?eventId=${eventId}&quantity=${quantity}`);
  };

  return (
    <div className='p-6 max-w-3xl mx-auto space-y-6'>
      <h1 className='text-3xl font-bold'>{event.title}</h1>
      <p className='text-gray-700'>{event.description}</p>

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

      {coords && (
        <MapDisplay
          latitude={coords.lat}
          longitude={coords.lng}
          zoom={14}
        />
      )}

      {auth.userType !== 'organiser' && (
        <div className='space-y-4'>
          <div className='flex items-center space-x-6'>
            <button
              disabled={quantity >= event.availableTickets}
              onClick={() => setQuantity(q => q + 1)}
              className='w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full text-3xl font-bold hover:bg-gray-300'>
              +
            </button>
            <button
              disabled={quantity <= 1}
              onClick={() => setQuantity(q => q - 1)}
              className='w-12 h-12 flex items-center justify-center bg-gray-200 rounded-full text-3xl font-bold hover:bg-gray-300'>
              –
            </button>
            <span>Quantity: {quantity}</span>
          </div>
          <button
            onClick={handleReserve}
            disabled={isReserving || event.availableTickets < 1}
            className='px-4 py-2 bg-green-500 text-white rounded'>
            {isReserving
              ? 'Reserving…'
              : quantity === 1
              ? 'Reserve ticket'
              : `Reserve ${quantity} tickets`}
          </button>
        </div>
      )}

      <h2 className='mt-6 text-lg font-semibold'>Gallery</h2>
      {imagesLoading ? (
        <p>Loading images…</p>
      ) : images && images.length > 0 ? (
        <div className='grid grid-cols-3 gap-4'>
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
        <div className='flex space-x-4 mt-6'>
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
