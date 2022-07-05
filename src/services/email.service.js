import nodemailer from 'nodemailer';
import { email } from '../config/env.js';
import Chad from '../libs/chad.js';
import logger from '../libs/logger.js';
import { red } from '../utils/rainbow-log.js';

const transporter = nodemailer.createTransport({
  host: email.host,
  port: email.port,
  secure: email.secure,
  auth: {
    user: email.auth_email,
    pass: email.auth_pass,
  },
});

export default class EmailService {
  static async send({ to, subject, template = 'default', data }) {
    try {
      const sent = await transporter.sendMail({
        from: `"Gains" <${email.auth_email}>`,
        to,
        subject,
        html: template,
      });

      if (!sent) throw new Error('Something went wrong while sending email!');
      logger.info('');
    } catch (e) {
      logger.error(e);
      s;
      Chad.flex(e.message, e);
    }
  }
}

const a = await EmailService.send({
  to: 'zombyard@gmail.com',
  subject: 'testing',
  data: { id: 1, user: 'jaw' },
});
