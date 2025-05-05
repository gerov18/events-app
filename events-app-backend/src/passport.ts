import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const secret = process.env.JWT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: 'http://localhost:5008/authentication/google/callback',
    },
    async (_acessToken, _refreshToken, profile, done) => {
      try {
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.emails?.[0].value!,
              username: profile.displayName,
              googleId: profile.id,
              firstName: profile.name?.familyName!,
              lastName: profile.name?.givenName!,
              createdAt: new Date(),
            },
          });
        }
        const token = jwt.sign({ id: user.id }, secret!, { expiresIn: '24h' });

        return done(null, { user, token });
      } catch (error) {
        done(error);
      }
    }
  )
);
