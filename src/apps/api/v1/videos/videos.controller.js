import { StatusCodes } from 'http-status-codes';
import * as VideosQueries from './videos.queries.js';
import CustomError from '../../api.errors.js';
import logger from '../../../../utils/logger.js';
import fs from 'fs';

export async function getVideo(req, res) {
  const id = req.params.id;
  const video = await VideosQueries.findVideoById(id);

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: video,
  });
}

export async function getStreamVideo(req, res) {
  const id = req.params.id;

  const range = req.headers.range;
  if (!req.headers.range) throw new CustomError.BadRequestError('Requires range header!');

  const [video] = await VideosQueries.findVideoById(id);

  const videoSize = fs.statSync(video.video_path).size;

  const CHUNK_SIZE = 7 ** 6; // 7th of a 1MB
  const start = Number(range.replace(/\D/g, ''));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4',
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const videoStream = fs.createReadStream(video.video_path, { start, end });

  // Stream the video chunk to the client
  videoStream.pipe(res);
}
