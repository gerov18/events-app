import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';

const stripe = require('stripe')(process.env.STRIPE_SECRET);
const router = Router();

router.post('/', authenticate, async (req, res) => {
  const { amount, id } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'EUR',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      description: 'Haidi Events',
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: 'Payment failed', error });
  }
});

export default router;
