import { email } from './env.js';

export default {
  host: email.host,
  port: email.port,
  auth: {
    user: email.auth_email,
    pass: email.auth_pass,
  },
};
