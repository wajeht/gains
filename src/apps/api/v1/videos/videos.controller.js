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
  if (!req.headers.range) throw new CustomError.BadRequestError('Requires range header!');

  const [video] = await VideosQueries.findVideoById(id);

  const path = video.video_path;
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;

  // if (range) {
  const parts = range.replace(/bytes=/, '').split('-');
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

  if (start >= fileSize) {
    res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
    return;
  }

  const chunksize = end - start + 1;
  const file = fs.createReadStream(path, { start, end });
  const head = {
    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': chunksize,
    'Content-Type': 'video/mp4',
  };

  res.writeHead(206, head);
  file.pipe(res);
  // } else {
  //   const head = {
  //     'Content-Length': fileSize,
  //     'Content-Type': 'video/mp4',
  //   };
  //   res.writeHead(200, head);
  //   fs.createReadStream(path).pipe(res);
  // }
}

/**
 * It gets the video path from the database, and then sends the video to the user
 * @param req - The request object.
 * @param res - The response object.
 */
export async function getDownloadVideo(req, res) {
  const { id } = req.params;

  const [{ video_path }] = await VideosQueries.findVideoById(id);

  res.status(StatusCodes.OK).download(video_path);
}
