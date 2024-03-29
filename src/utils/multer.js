import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env.js';

function mb(value) {
  return value * 1024 * 1024;
}

const imageFileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const mimetype = fileTypes.test(file.mimetype);
  const extname = fileTypes.test(path.extname(file.originalname));

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(null, false);
  }
};

const imageLimits = {
  fileSize: env === 'production' ? mb(3) : mb(1000),
};

const videoLimits = {
  fileSize: env === 'production' ? mb(10) : mb(1000),
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(path.join(process.cwd(), 'src', 'public', 'uploads')));
  },
  filename: (req, file, cb) => {
    const fileExtension = file.originalname.split('.')[1];
    cb(null, file.fieldname + '-' + uuidv4() + '.' + fileExtension);
  },
});

const imageMulter = multer({
  fileFilter: imageFileFilter,
  limits: imageLimits,
  storage,
});

const videoMulter = multer({
  limits: videoLimits,
  storage,
});

export const uploadPicture = imageMulter.single('picture');

export const uploadVideo = videoMulter.single('video');
