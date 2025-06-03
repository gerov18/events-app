import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET!;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:5008/authentication/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.emails![0].value!,
              username: profile.displayName.replace(/\s+/g, '_'),
              googleId: profile.id,
              firstName: profile.name!.givenName!,
              lastName: profile.name!.familyName!,
              role: 'USER',
              createdAt: new Date(),
            },
          });
        }

        const payload = { id: user.id, role: user.role };
        const token = jwt.sign(payload, secret, { expiresIn: '24h' });

        return done(null, { user, token });
      } catch (err) {
        done(err as any);
      }
    }
  )
);
