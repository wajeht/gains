import express from 'express';
const follows = express.Router();

follows.get('/', (req, res) => {
  res.json({
    message: 'ok',
  });
});

export default follows;
