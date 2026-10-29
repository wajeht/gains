import { email } from './env.js';

export default {
  host: email.host,
  proxy: process.env.SMTP_PROXY,
  port: email.port,
  auth: {
    user: email.auth_email,
    pass: email.auth_pass,
  },
};
