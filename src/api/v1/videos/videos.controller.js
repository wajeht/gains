import { StatusCodes } from '../../../config/status-codes.js';
import * as VideosQueries from './videos.queries.js';

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
