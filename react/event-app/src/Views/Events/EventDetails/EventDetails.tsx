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
import Modal from '../../../Components/Modal/Modal';
import noPicImg from '../../../assets/noPic.webp';

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
      navigate(`/organiser/${auth.user?.id}`, { replace: true });
    }
  }, [isError, navigate]);

  if (!event) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-gray-500 text-lg'>Event not found.</p>
      </div>
    );
  }
  if (isLoading || isCatLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <p className='text-gray-500 text-lg'>Loading event details…</p>
      </div>
    );
  }

  const isOwner =
    auth.userType === 'organiser' && auth.user?.id === event.createdBy;
  console.log('ISS', isOwner, event.createdBy, auth.user?.id);
  const handleDelete = async () => {
    try {
      await deleteEvent(eventId).unwrap();
      navigate(`/organiser/${auth.user?.id}`);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleReserve = () => {
    navigate(`/checkout?eventId=${eventId}&quantity=${quantity}`);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    handleDelete();
  };

  const thumbnailUrl =
    event.images && event.images.length > 0 ? event.images[0].url : noPicImg;

  return (
    <div className='min-h-screen bg-gray-50 py-12 px-4 md:px-8 lg:px-16'>
      <div className='max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden'>
        <div className='relative h-80'>
          <img
            src={thumbnailUrl}
            alt={event.title}
            className='w-full h-full object-cover'
          />
        </div>

        <div className='p-8 space-y-8'>
          <div className='space-y-4'>
            <h1 className='text-4xl font-extrabold text-gray-900'>
              {event.title}
            </h1>
            <p className='text-gray-700 leading-relaxed'>{event.description}</p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 border-t pt-6'>
            <div className='space-y-4'>
              <div className='flex items-center'>
                <span className='w-28 font-medium text-gray-800'>Date:</span>
                <span className='text-gray-600'>
                  {moment(event.date).format('DD MMM YYYY')}
                </span>
              </div>
              <div className='flex items-center'>
                <span className='w-28 font-medium text-gray-800'>
                  Location:
                </span>
                <span className='text-gray-600'>{event.location}</span>
              </div>
              <div className='flex items-center'>
                <span className='w-28 font-medium text-gray-800'>
                  Category:
                </span>
                <span className='text-gray-600'>{category?.name}</span>
              </div>
            </div>

            <div className='space-y-4'>
              <div className='flex items-center'>
                <span className='w-28 font-medium text-gray-800'>Price:</span>
                <span className='text-gray-600'>${event.price.toFixed(2)}</span>
              </div>
              <div className='flex items-center'>
                <span className='w-28 font-medium text-gray-800'>
                  Capacity:
                </span>
                <span className='text-gray-600'>{event.capacity}</span>
              </div>
              <div className='flex items-center'>
                <span className='w-28 font-medium text-gray-800'>
                  Available:
                </span>
                <span className='text-gray-600'>{event.availableTickets}</span>
              </div>
            </div>
          </div>

          {coords && (
            <div className='mt-6 rounded-lg overflow-hidden shadow-lg'>
              <MapDisplay
                latitude={coords.lat}
                longitude={coords.lng}
                zoom={14}
              />
            </div>
          )}

          {auth.userType !== 'organiser' && (
            <div className='mt-6 bg-gray-100 rounded-lg p-6 space-y-6'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Reserve Tickets
              </h2>
              <div className='flex items-center space-x-4'>
                <button
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(q => q - 1)}
                  className='w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full text-2xl font-semibold text-gray-700 transition transform hover:scale-110'>
                  –
                </button>
                <button
                  disabled={quantity >= event.availableTickets}
                  onClick={() => setQuantity(q => q + 1)}
                  className='w-12 h-12 flex items-center justify-center bg-white border border-gray-300 rounded-full text-2xl font-semibold text-gray-700 transition transform hover:scale-110'>
                  +
                </button>
                <span className='text-lg font-medium text-gray-800'>
                  Quantity: {quantity}
                </span>
              </div>
              <button
                onClick={handleReserve}
                disabled={isReserving || event.availableTickets < 1}
                className='w-full text-center px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 transition'>
                {isReserving
                  ? 'Reserving…'
                  : quantity === 1
                  ? 'Reserve Ticket'
                  : `Reserve ${quantity} Tickets`}
              </button>
            </div>
          )}

          <div className='mt-8'>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              Gallery
            </h2>
            {imagesLoading ? (
              <div className='text-gray-500'>Loading images…</div>
            ) : images && images.length > 0 ? (
              <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                {images.map((img: Image) => (
                  <img
                    key={img.id}
                    src={img.url}
                    alt={`Event ${event.id} photo ${img.id}`}
                    className='w-full h-40 object-cover rounded-lg shadow-sm'
                  />
                ))}
              </div>
            ) : (
              <div className='text-gray-500'>No images uploaded yet.</div>
            )}
          </div>

          {isOwner && (
            <div className='mt-8 flex justify-end space-x-4'>
              <Link
                to={`/events/${event.id}/edit`}
                className='px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-md transition transform hover:scale-105'>
                Edit
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isDeleting}
                className={`px-6 py-3 rounded-lg font-medium text-white transition transform hover:scale-105 ${
                  isDeleting
                    ? 'bg-gray-300 text-gray-600'
                    : 'bg-red-500 hover:bg-red-600'
                } shadow-md`}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        title='Confirm Deletion'
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        confirmText='Delete'
        cancelText='Cancel'>
        <p className='text-gray-700'>
          Are you sure you want to delete this event? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
};

export default EventDetails;
