import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/auth/google/failure',
  }),
  (req, res) => {
    const { token } = req.user as any;

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect('http://localhost:5173/');
  }
);

// router.get('/google/failure', (_req, res) => {
//   return res.status(401).json({ message: 'Google Authentication Failed' });
// });

export default router;
