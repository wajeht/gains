import path from 'path';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';

import express from 'express';
const app = express();

const PORT = 8080;
import api from './api/api.js';

// TODO!: configure this helmet for production
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(cors({ origin: '*' }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(path.join(process.cwd(), "src", "public")))); // prettier-ignore

app.use('/api', api);

app.use('*', (req, res, next) => {
  try {
    res.sendFile(path.resolve(path.join(process.cwd(), "src", "public", "index.html"))); // prettier-ignore
  } catch (error) {
    next(error);
  }
});

app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
