import express from 'express';
const messages = express.Router();

messages.get('/', (req, res) => {
  res.json({
    message: 'ok',
  });
});

export default messages;
