import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { prisma } from '../prismaClient';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID!;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET!;

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let usuario = await prisma.usuario.findUnique({ where: { googleId: profile.id } });
    if (!usuario) {
      const email = profile.emails?.[0].value ?? '';
      usuario = await prisma.usuario.create({
        data: {
          nome: profile.displayName,
          email,
          googleId: profile.id,
        },
      });
    }
    done(null, usuario);
  } catch (err) {
    done(err as Error, false);
  }
}));

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let usuario = await prisma.usuario.findUnique({ where: { facebookId: profile.id } });
    if (!usuario) {
      const email = profile.emails?.[0].value ?? '';
      usuario = await prisma.usuario.create({
        data: {
          nome: `${profile.name?.givenName ?? ''} ${profile.name?.familyName ?? ''}`,
          email,
          facebookId: profile.id,
        },
      });
    }
    done(null, usuario);
  } catch (err) {
    done(err as Error, false);
  }
}));

export default passport;