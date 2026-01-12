import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { root } from './directory.js';
import logger from './logger.js';

const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];
const TOKEN_PATH = path.join(root, 'youtube-token.json');

// OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI
);

// Load saved token if exists
function loadToken() {
  try {
    if (fs.existsSync(TOKEN_PATH)) {
      const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
      oauth2Client.setCredentials(token);
      return true;
    }
  } catch (err) {
    logger.error('Error loading YouTube token:', err);
  }
  return false;
}

// Save token to file
function saveToken(token) {
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
  logger.info('YouTube token saved');
}

// Get auth URL for initial setup
export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
}

// Exchange code for token (called from callback route)
export async function exchangeCode(code) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  saveToken(tokens);
  return tokens;
}

// Check if authenticated
export function isAuthenticated() {
  return loadToken();
}

// Refresh token if needed
oauth2Client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    saveToken(tokens);
  }
});

// Upload video to YouTube as unlisted
export async function uploadToYouTube(videoPath, title, description = '') {
  if (!loadToken()) {
    throw new Error('YouTube not authenticated. Visit /api/v1/youtube/auth to authorize.');
  }

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  const fileSize = fs.statSync(videoPath).size;

  const res = await youtube.videos.insert(
    {
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title: title || 'Workout Video',
          description: description || 'Uploaded via Gains app',
          categoryId: '17', // Sports category
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
    }
  );

  logger.info(`YouTube video uploaded: ${res.data.id}`);

  return {
    youtube_video_id: res.data.id,
    youtube_url: `https://www.youtube.com/watch?v=${res.data.id}`,
    youtube_embed_url: `https://www.youtube.com/embed/${res.data.id}`,
    youtube_thumbnail: res.data.snippet?.thumbnails?.default?.url || null,
  };
}

// Delete video from YouTube
export async function deleteFromYouTube(videoId) {
  if (!loadToken()) {
    throw new Error('YouTube not authenticated');
  }

  const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

  await youtube.videos.delete({ id: videoId });
  logger.info(`YouTube video deleted: ${videoId}`);
}
