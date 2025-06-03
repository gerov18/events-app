// src/Views/Checkout/CheckoutPage.tsx

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useGetEventByIdQuery } from '../../../api/events/eventApi';
import { useCreateReservationMutation } from '../../../api/reservations/reservationsApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../../api/store';
import moment from 'moment';
import PaymentForm from '../../../Components/PaymentForm/PaymentForm';
import noPicImg from '../../../assets/noPic.webp';

const stripePromise = loadStripe(
  'pk_test_51RTzg8PLvptwVh3jjWWfUib7asqjolZ3TSF0hpcb1V5NAgqGJ4mEWQJsAYpoVGFOjOwVQ3yCVcPqDKVvtFhsONzl00qRVPtyos'
);

export const Checkout = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);
  const eventId = Number(params.get('eventId'));
  const quantity = Number(params.get('quantity'));
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const {
    data: event,
    isLoading: isEventLoading,
    isError: isEventError,
  } = useGetEventByIdQuery(eventId);
  const [createReservation, { isLoading: isReserving }] =
    useCreateReservationMutation();

  if (isEventLoading) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-50'>
        <p className='text-gray-500 text-lg'>Loading event details…</p>
      </div>
    );
  }

  if (isEventError || !event) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-50'>
        <p className='text-red-600 text-lg'>Failed to load event.</p>
      </div>
    );
  }

  const unitPrice = event.price;
  const totalPrice = unitPrice * quantity;
  const amountInCents = Math.round(totalPrice * 100);
  const imgUrl =
    event.images && event.images.length > 0 ? event.images[0].url : noPicImg;

  const handlePaymentSuccess = async () => {
    try {
      const newReservation = await createReservation({
        eventId,
        quantity,
      }).unwrap();
      const newReservationId = newReservation.id;

      if (userId != null && newReservationId != null) {
        navigate(`/user/${userId}/reservations/${newReservationId}`);
      } else {
        navigate('/user/me');
      }
    } catch (err) {
      console.error('Reservation failed:', err);
      alert('Could not create reservation.');
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 py-12 px-4 md:px-8 lg:px-16'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='md:flex'>
            <div className='md:w-1/2'>
              <img
                src={imgUrl}
                alt={event.title}
                className='w-full h-64 object-cover md:h-full'
              />
            </div>
            <div className='md:w-1/2 p-8'>
              <h1 className='text-3xl font-extrabold text-gray-900 mb-4'>
                {event.title}
              </h1>
              <p className='text-gray-600 mb-2'>
                <span className='font-medium'>Date:</span>{' '}
                {moment(event.date).format('DD MMMM YYYY')}
              </p>
              <p className='text-gray-600 mb-2'>
                <span className='font-medium'>Location:</span> {event.location}
              </p>
              <div className='border-t border-gray-200 pt-4 mb-6'>
                <p className='text-lg text-gray-800'>
                  <span className='font-semibold'>{quantity}</span> ×{' '}
                  <span className='font-semibold'>{unitPrice.toFixed(2)}€</span>{' '}
                  ={' '}
                  <span className='font-bold text-gray-900'>
                    ${totalPrice.toFixed(2)}
                  </span>
                </p>
              </div>

              <Elements stripe={stripePromise}>
                <PaymentForm
                  amount={amountInCents}
                  onSuccess={handlePaymentSuccess}
                />
              </Elements>

              <button
                onClick={() => navigate(-1)}
                className='mt-6 block w-full text-center text-gray-600 hover:underline text-sm'>
                ← Back
              </button>
            </div>
          </div>

          {isReserving && (
            <div className='absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center'>
              <p className='text-gray-700 text-lg'>Processing reservation…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
