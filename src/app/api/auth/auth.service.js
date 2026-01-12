import crypto from 'crypto';
import { google } from '../../../config/env.js';

export function generateOAuthState() {
  return crypto.randomUUID();
}

export function getGoogleOAuthURL(state) {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

  const options = {
    redirect_uri: google.redirectUrl,
    client_id: google.clientId,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/youtube.upload',
    ].join(' '),
    state,
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
}

export async function getGoogleOAuthToken({ code }) {
  const url = 'https://oauth2.googleapis.com/token';

  const values = {
    code,
    client_id: google.clientId,
    client_secret: google.clientSecret,
    redirect_uri: google.redirectUrl,
    grant_type: 'authorization_code',
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(values),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to get Google OAuth token: ${error}`);
  }

  return res.json();
}

export async function getGoogleUser({ id_token, access_token }) {
  const res = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
    {
      headers: {
        Authorization: `Bearer ${id_token}`,
      },
    },
  );

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Failed to get Google user: ${error}`);
  }

  return res.json();
}
