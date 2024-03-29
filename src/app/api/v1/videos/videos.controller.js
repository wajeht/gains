import { StatusCodes } from 'http-status-codes';
import * as VideosQueries from './videos.queries.js';
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
  if (!req.headers.range) {
    res.status(400);
    res.send('Requires range header!');
    return;
  }

  const [video] = await VideosQueries.findVideoById(id);
  const path = video.video_path;

  fs.stat(path, async function (err, stat) {
    if (err) {
      if (err.code === 'ENOENT') {
        res.status(404);
        res.send('Not Found');
        return;
      }
      console.error(err);
      res.status(500);
      res.send('Internal Server Error');
      return;
    }

    const fileSize = stat.size;
    const range = req.headers.range;

    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
      res.status(416);
      res.send('Requested range not satisfiable');
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

    file.on('error', function (err) {
      console.error(err);
      res.status(500);
      res.send('Internal Server Error');
      return;
    });

    file.pipe(res);
  });
}

export async function getDownloadVideo(req, res) {
  const { id } = req.params;

  const [{ video_path }] = await VideosQueries.findVideoById(id);

  res.status(StatusCodes.OK).download(video_path);
}
