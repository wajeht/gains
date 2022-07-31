import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const mimetype = fileTypes.test(file.mimetype);
  const extname = fileTypes.test(path.extname(file.originalname));

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(null, false);
  }
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

const limits = {
  fileSize: 3 * 1024 * 1024, // 3mb
};

const upload = multer({
  fileFilter,
  storage,
  limits,
});

export const uploadPicture = upload.single('picture');
