import { StatusCodes } from 'http-status-codes';
import logger from '../../utils/logger.js';
import { env, jwt_secret, admin } from '../../config/env.js';
import jwt from 'jsonwebtoken';
import pkg from '../../utils/pkg.js';
import db from '../../../db/db.js';
import crypto from 'crypto';
import * as authService from './auth.service.js';
import generateDefaultExercises from '../../utils/generate-default-exercises.js';

export function getGoogleOAuth(req, res) {
  const state = authService.generateOAuthState();
  req.session = req.session || {};
  req.session.oauthState = state;

  res.cookie('oauth_state', state, {
    httpOnly: true,
    secure: env === 'production',
    maxAge: 10 * 60 * 1000, // 10 minutes
    signed: true,
  });

  const origin = req.get('Referer') || req.get('Origin') || '';
  if (origin) {
    res.cookie('oauth_origin', origin, {
      httpOnly: true,
      secure: env === 'production',
      maxAge: 10 * 60 * 1000,
      signed: true,
    });
  }

  const url = authService.getGoogleOAuthURL(state);
  res.redirect(url);
}

export async function getGoogleOAuthRedirect(req, res) {
  const { code, state } = req.query;

  const origin = req.signedCookies.oauth_origin || '';
  const getRedirectUrl = (path) => {
    if (origin && env !== 'production') {
      try {
        const originUrl = new URL(origin);
        return `${originUrl.protocol}//${originUrl.host}${path}`;
      } catch (e) {}
    }
    return path;
  };

  const storedState = req.signedCookies.oauth_state;
  if (
    !state ||
    !storedState ||
    !crypto.timingSafeEqual(Buffer.from(state), Buffer.from(storedState))
  ) {
    logger.warn('OAuth state mismatch - possible CSRF attempt');
    res.clearCookie('oauth_origin');
    return res.redirect(getRedirectUrl('/login?error=invalid_state'));
  }

  res.clearCookie('oauth_state');

  try {
    const tokens = await authService.getGoogleOAuthToken({ code });
    const { id_token, access_token, refresh_token, expires_in } = tokens;

    const googleUser = await authService.getGoogleUser({ id_token, access_token });

    const tokenExpiresAt = expires_in ? new Date(Date.now() + expires_in * 1000) : null;

    if (!googleUser.verified_email) {
      logger.warn(`Unverified Google email attempted login: ${googleUser.email}`);
      res.clearCookie('oauth_origin');
      return res.redirect(getRedirectUrl('/login?error=unverified_email'));
    }

    let [user] = await db.select('*').from('users').where({ email: googleUser.email });

    if (!user) {
      const username = googleUser.email.split('@')[0] + '_' + crypto.randomBytes(4).toString('hex');

      const [newUser] = await db('users')
        .insert({
          email: googleUser.email,
          username: username,
        })
        .returning('*');

      user = newUser;

      const isAdmin = admin.email && googleUser.email.toLowerCase() === admin.email.toLowerCase();
      await db('user_details').insert({
        user_id: user.id,
        first_name: googleUser.given_name || null,
        last_name: googleUser.family_name || null,
        profile_picture_url: googleUser.picture || null,
        role: isAdmin ? 'admin' : 'user',
        verified: true,
        verified_at: new Date(),
        google_access_token: access_token,
        google_refresh_token: refresh_token || null,
        google_token_expires_at: tokenExpiresAt,
      });

      if (isAdmin) {
        logger.info(`Admin privileges granted to: ${user.email}`);
      }

      logger.info(`New user created via Google OAuth: ${user.email} (ID: ${user.id})`);

      generateDefaultExercises(user.id);
      logger.info(`Generated default exercises for User id ${user.id}!`);
    } else {
      const isAdmin = admin.email && googleUser.email.toLowerCase() === admin.email.toLowerCase();
      const updateData = {
        google_access_token: access_token,
        google_token_expires_at: tokenExpiresAt,
      };
      if (refresh_token) {
        updateData.google_refresh_token = refresh_token;
      }
      if (isAdmin) {
        const [userDetails] = await db('user_details').where({ user_id: user.id });
        if (userDetails && userDetails.role !== 'admin') {
          updateData.role = 'admin';
          logger.info(`Admin privileges granted to existing user: ${user.email}`);
        }
      }
      await db('user_details').update(updateData).where({ user_id: user.id });
      logger.info(`User logged in via Google OAuth: ${user.email} (ID: ${user.id})`);
    }

    const [userWithDetails] = await db
      .select('*')
      .from('users')
      .leftJoin('user_details', 'users.id', 'user_details.user_id')
      .where({ 'users.id': user.id });

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

    const userData = encodeURIComponent(
      JSON.stringify({
        id: userWithDetails.id,
        role: userWithDetails.role,
        email: userWithDetails.email,
        username: userWithDetails.username,
        first_name: userWithDetails.first_name,
        last_name: userWithDetails.last_name,
        weight: userWithDetails.weight,
        profile_picture_url: userWithDetails.profile_picture_url,
      }),
    );

    res.clearCookie('oauth_origin');
    res.redirect(getRedirectUrl(`/oauth/callback?user=${userData}&appVersion=${pkg.version}`));
  } catch (error) {
    logger.error('Google OAuth error:', error);
    res.clearCookie('oauth_origin');
    res.redirect(getRedirectUrl('/login?error=oauth_failed'));
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
