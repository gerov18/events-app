import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { useCreatePaymentMutation } from '../../api/paymentApi/paymentApi';

interface PaymentFormProps {
  amount: number; // in cents
  onSuccess: () => Promise<void>;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [createPayment] = useCreatePaymentMutation();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });
    if (pmError || !paymentMethod) {
      setError(pmError?.message || 'PaymentMethod error');
      setProcessing(false);
      return;
    }

    try {
      await createPayment({ id: paymentMethod.id, amount }).unwrap();
      await onSuccess();
    } catch (err: any) {
      setError(err.data?.error || err.message || 'Payment failed');
    }

    setProcessing(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-4'>
      <CardElement />
      {error && <p className='text-red-500'>{error}</p>}
      <button
        type='submit'
        disabled={!stripe || processing}
        className='px-4 py-2 bg-blue-600 text-white rounded'>
        {processing ? 'Processing…' : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
};

export default PaymentForm;
