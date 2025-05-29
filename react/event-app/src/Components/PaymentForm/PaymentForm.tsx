import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useForm } from 'react-hook-form';
import { useCreatePaymentMutation } from '../../api/paymentApi/paymentApi';

const CARD_OPTIONS = {
  iconStyle: 'solid',
  style: {
    base: {
      //   backgroundColor: `${resolvedTheme === 'dark' ? 'black' : 'white'}`,
      backgroundColor: 'black',
      color: 'white',
      iconColor: '#6D28D9',
      //   color: `${resolvedTheme === 'dark' ? 'white' : '#9CA3AF'}`,
      fontWeight: '500',
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {
        color: '#fce883',
      },
      '::placeholder': {
        color: '#D1D5DB',
      },
    },
    invalid: {
      iconColor: '#ef2961',
      color: '#ef2961',
    },
  },
};

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  useForm();

  const [
    createPayment,
    { isSuccess: paymentSuccess, data: paymentData, error: createPaymentError },
  ] = useCreatePaymentMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (!paymentMethod) return;

    const { id } = paymentMethod;
    await createPayment({ id, amount: 1000 });
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={CARD_OPTIONS} />

      <button>Pay</button>
    </form>
  );
};

export default PaymentForm;
