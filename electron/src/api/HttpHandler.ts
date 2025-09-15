import axios from 'axios';

export const HttpHandler = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});
