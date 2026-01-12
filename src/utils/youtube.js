import { google } from 'googleapis';
import fs from 'fs';
import logger from './logger.js';
import db from '../db/db.js';

function createOAuth2Client(tokens) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );
  oauth2Client.setCredentials({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  });
  return oauth2Client;
}

async function refreshTokenIfNeeded(userId, tokens) {
  const expiresAt = tokens.google_token_expires_at;
  if (!expiresAt || new Date(expiresAt) > new Date(Date.now() + 5 * 60 * 1000)) {
    return tokens;
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );
  oauth2Client.setCredentials({ refresh_token: tokens.google_refresh_token });

  const { credentials } = await oauth2Client.refreshAccessToken();

  await db('user_details')
    .update({
      google_access_token: credentials.access_token,
      google_token_expires_at: new Date(credentials.expiry_date),
    })
    .where({ user_id: userId });

  logger.info(`Refreshed Google token for user ${userId}`);

  return {
    ...tokens,
    google_access_token: credentials.access_token,
    google_token_expires_at: new Date(credentials.expiry_date),
  };
}

export async function uploadToYouTube(userId, videoPath, title, description = '') {
  const [userDetails] = await db('user_details').where({ user_id: userId });

  if (!userDetails?.google_access_token) {
    throw new Error('User not authenticated with Google. Please re-login.');
  }

  const tokens = await refreshTokenIfNeeded(userId, userDetails);

  const oauth2Client = createOAuth2Client({
    access_token: tokens.google_access_token,
    refresh_token: tokens.google_refresh_token,
  });

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  const fileSize = fs.statSync(videoPath).size;

  const res = await youtube.videos.insert(
    {
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: title || 'Workout Video',
          description: description || 'Uploaded via Gains app',
          categoryId: '17',
        },
        status: {
          privacyStatus: 'unlisted',
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        body: fs.createReadStream(videoPath),
      },
    },
    {
      onUploadProgress: (evt) => {
        const progress = (evt.bytesRead / fileSize) * 100;
        logger.info(`YouTube upload progress: ${Math.round(progress)}%`);
      },
    },
  );

  logger.info(`YouTube video uploaded: ${res.data.id}`);

  return {
    youtube_video_id: res.data.id,
    youtube_url: `https://www.youtube.com/watch?v=${res.data.id}`,
    youtube_embed_url: `https://www.youtube.com/embed/${res.data.id}`,
    youtube_thumbnail: res.data.snippet?.thumbnails?.default?.url || null,
  };
}

export async function deleteFromYouTube(userId, videoId) {
  const [userDetails] = await db('user_details').where({ user_id: userId });

  if (!userDetails?.google_access_token) {
    throw new Error('User not authenticated with Google');
  }

  const tokens = await refreshTokenIfNeeded(userId, userDetails);

  const oauth2Client = createOAuth2Client({
    access_token: tokens.google_access_token,
    refresh_token: tokens.google_refresh_token,
  });

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  await youtube.videos.delete({ id: videoId });
  logger.info(`YouTube video deleted: ${videoId}`);
}
