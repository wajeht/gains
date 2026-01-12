import { StatusCodes } from 'http-status-codes';
import * as youtube from '../../../../utils/youtube.js';
import logger from '../../../../utils/logger.js';

export async function getAuthUrl(req, res) {
  const url = youtube.getAuthUrl();
  res.redirect(url);
}

export async function handleCallback(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'No authorization code provided',
    });
  }

  try {
    await youtube.exchangeCode(code);
    logger.info('YouTube OAuth completed successfully');

    res.status(StatusCodes.OK).send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1>YouTube Authorization Successful!</h1>
          <p>You can close this window and return to the app.</p>
        </body>
      </html>
    `);
  } catch (err) {
    logger.error('YouTube OAuth error:', err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Failed to complete YouTube authorization',
    });
  }
}

export async function getStatus(req, res) {
  const authenticated = youtube.isAuthenticated();

  res.status(StatusCodes.OK).json({
    status: 'success',
    data: {
      authenticated,
      authUrl: authenticated ? null : '/api/v1/youtube/auth',
    },
  });
}
