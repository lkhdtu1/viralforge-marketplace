import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import env from './env';
import { findOrCreateOAuthUser } from '../services/oauth.service';
import prisma from './database';

// Configure Google OAuth
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/v1/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await findOrCreateOAuthUser(
            'google',
            profile.id,
            profile.emails?.[0]?.value || '',
            {
              firstName: profile.name?.givenName,
              lastName: profile.name?.familyName,
              displayName: profile.displayName,
              avatar: profile.photos?.[0]?.value,
            }
          );
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// Configure Twitter OAuth
if (env.TWITTER_CONSUMER_KEY && env.TWITTER_CONSUMER_SECRET) {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: env.TWITTER_CONSUMER_KEY,
        consumerSecret: env.TWITTER_CONSUMER_SECRET,
        callbackURL: env.TWITTER_CALLBACK_URL || '/api/v1/auth/twitter/callback',
        includeEmail: true,
      },
      async (token, tokenSecret, profile, done) => {
        try {
          const user = await findOrCreateOAuthUser(
            'twitter',
            profile.id,
            profile.emails?.[0]?.value || `twitter_${profile.id}@twitter.com`,
            {
              displayName: profile.displayName,
              avatar: profile.photos?.[0]?.value,
            }
          );
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// Serialize user for session (not used with JWT, but required by Passport)
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;

