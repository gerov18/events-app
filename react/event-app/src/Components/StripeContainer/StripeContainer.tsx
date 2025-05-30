import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../PaymentForm/PaymentForm';

// For Vite:
const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

const stripeTestPromise = loadStripe(
  'pk_test_51RTzg8PLvptwVh3jjWWfUib7asqjolZ3TSF0hpcb1V5NAgqGJ4mEWQJsAYpoVGFOjOwVQ3yCVcPqDKVvtFhsONzl00qRVPtyos'
);

export const StripeContainer = () => {
  return (
    <Elements stripe={stripeTestPromise}>{/* <PaymentForm /> */}</Elements>
  );
};
