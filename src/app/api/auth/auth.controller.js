import { StatusCodes } from 'http-status-codes';
import * as UsersQueries from '../v1/users/users.queries.js';
import logger from '../../../utils/logger.js';
import CustomError from '../api.errors.js';
import { env, domain, jwt_secret } from '../../../config/env.js';
import jwt from 'jsonwebtoken';
import pkg from '../../../utils/pkg.js';
import db from '../../../database/db.js';
import crypto from 'crypto';
import * as authService from './auth.service.js';
import generateDefaultExercises from '../../../utils/generate-default-exercises.js';

// Initiate Google OAuth flow
export function getGoogleOAuth(req, res) {
  const state = authService.generateOAuthState();
  req.session = req.session || {};
  req.session.oauthState = state;

  // Store state in a cookie for stateless verification
  res.cookie('oauth_state', state, {
    httpOnly: true,
    secure: env === 'production',
    maxAge: 10 * 60 * 1000, // 10 minutes
    signed: true,
  });

  const url = authService.getGoogleOAuthURL(state);
  res.redirect(url);
}

// Handle Google OAuth callback
export async function getGoogleOAuthRedirect(req, res) {
  const { code, state } = req.query;

  // Verify state to prevent CSRF
  const storedState = req.signedCookies.oauth_state;
  if (!state || !storedState || !crypto.timingSafeEqual(Buffer.from(state), Buffer.from(storedState))) {
    logger.warn('OAuth state mismatch - possible CSRF attempt');
    return res.redirect('/login?error=invalid_state');
  }

  // Clear the state cookie
  res.clearCookie('oauth_state');

  try {
    // Exchange code for tokens
    const { id_token, access_token } = await authService.getGoogleOAuthToken({ code });

    // Get user info from Google
    const googleUser = await authService.getGoogleUser({ id_token, access_token });

    if (!googleUser.verified_email) {
      logger.warn(`Unverified Google email attempted login: ${googleUser.email}`);
      return res.redirect('/login?error=unverified_email');
    }

    // Find or create user
    let [user] = await db.select('*').from('users').where({ email: googleUser.email });

    if (!user) {
      // Create new user
      const username = googleUser.email.split('@')[0] + '_' + crypto.randomBytes(4).toString('hex');

      const [newUser] = await db('users')
        .insert({
          email: googleUser.email,
          username: username,
          verified: true,
          verified_at: new Date(),
          profile_picture_url: googleUser.picture || null,
        })
        .returning('*');

      user = newUser;

      // Create user details
      await db('user_details').insert({
        user_id: user.id,
        first_name: googleUser.given_name || null,
        last_name: googleUser.family_name || null,
      });

      logger.info(`New user created via Google OAuth: ${user.email} (ID: ${user.id})`);

      // Generate default exercises for new user
      generateDefaultExercises(user.id);
      logger.info(`Generated default exercises for User id ${user.id}!`);
    } else {
      logger.info(`User logged in via Google OAuth: ${user.email} (ID: ${user.id})`);
    }

    // Get user details
    const [userWithDetails] = await db
      .select('*')
      .from('users')
      .leftJoin('user_details', 'users.id', 'user_details.user_id')
      .where({ 'users.id': user.id });

    // Create JWT token
    const tokenPayload = {
      user_id: user.id,
      role: userWithDetails.role,
    };

    const tokenOptions = {
      issuer: 'AllKindsOfGains',
      expiresIn: '7d',
    };

    const token = jwt.sign(tokenPayload, jwt_secret, tokenOptions);

    res.cookie('token', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      secure: env === 'production',
      signed: true,
    });

    // Encode user data for frontend
    const userData = encodeURIComponent(JSON.stringify({
      id: userWithDetails.id,
      role: userWithDetails.role,
      email: userWithDetails.email,
      username: userWithDetails.username,
      first_name: userWithDetails.first_name,
      last_name: userWithDetails.last_name,
      weight: userWithDetails.weight,
      profile_picture_url: userWithDetails.profile_picture_url,
    }));

    // Redirect to frontend with user data
    res.redirect(`/oauth/callback?user=${userData}&appVersion=${pkg.version}`);
  } catch (error) {
    logger.error('Google OAuth error:', error);
    res.redirect('/login?error=oauth_failed');
  }
}

export function getLogout(req, res) {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: [{}],
  });
}
