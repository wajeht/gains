import nodemailer from 'nodemailer';
import { email } from '../config/env.js';
import logger from '../utils/logger.js';
import { templates } from './emails/templates.js';
import emailConfig from '../config/mail.config.js';

const transporter = nodemailer.createTransport(emailConfig);

transporter.verify((error, _success) => {
  if (error) {
    logger.error('email service failed', { error: error.message });
  } else {
    logger.info('email service started');
  }
});

export default class EmailService {
  static async send({ to, subject, template, data, files }) {
    try {
      const templateFn = templates[template];
      if (!templateFn) throw new Error(`Template "${template}" not found`);

      const mail = {
        from: `"Gains" <${email.from}>`,
        to,
        subject,
        text: templateFn(data),
      };

      if (files) {
        mail.attachments = files;
      }

      const sent = await transporter.sendMail(mail);

      if (!sent) throw new Error('Something went wrong while sending email!');

      logger.info(`${template} email sent to ${to}`);

      return sent;
    } catch (e) {
      logger.error('email send failed', { error: e.message });
    }
  }
}
