import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useGetEventByIdQuery } from '../../api/events/eventApi';
import { useCreateReservationMutation } from '../../api/reservations/reservationsApi';
import PaymentForm from '../../Components/PaymentForm/PaymentForm';

const stripePromise = loadStripe(
  'pk_test_51RTzg8PLvptwVh3jjWWfUib7asqjolZ3TSF0hpcb1V5NAgqGJ4mEWQJsAYpoVGFOjOwVQ3yCVcPqDKVvtFhsONzl00qRVPtyos'
);

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(useLocation().search);
  const eventId = Number(params.get('eventId'));
  const quantity = Number(params.get('quantity'));
  const { data: event, isLoading } = useGetEventByIdQuery(eventId);
  const [createReservation] = useCreateReservationMutation();

  if (isLoading || !event) return <div>Loading…</div>;

  const amount = Math.round(event.price * quantity * 100);

  console.log('eventId', eventId);
  console.log('quantity', quantity);

  const onPaymentSuccess = async () => {
    try {
      await createReservation({ eventId, quantity }).unwrap();
      navigate(`/users/${eventId}/reservations`);
    } catch (err) {
      console.error('Reservation failed:', err);
      alert('Could not create reservation.');
    }
  };

  return (
    <div className='p-6 max-w-md mx-auto'>
      <h2 className='text-xl font-semibold mb-4'>Checkout</h2>
      <p>
        {quantity} × ${event.price.toFixed(2)} = $
        {(event.price * quantity).toFixed(2)}
      </p>
      <Elements stripe={stripePromise}>
        <PaymentForm
          amount={amount}
          onSuccess={onPaymentSuccess}
        />
      </Elements>
    </div>
  );
};
