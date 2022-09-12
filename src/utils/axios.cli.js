import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.PROD_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.PROD_API_KEY,
  },
});

export default instance;
