import nodemailer from 'nodemailer';
import { email } from '../config/env.js';
import logger from '../utils/logger.js';
import Template from './emails/template.js';
import emailConfig from '../config/mail.config.js';

// use https://ethereal.email/ for testing purposes
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
      // mail options
      const mail = {
        from: `"Gains" <${email.auth_email}>`,
        to,
        subject,
        html: Template.generate(template, data),
      };

      if (files) {
        mail.attachments = files;
      }

      const sent = await transporter.sendMail(mail);

      if (!sent) throw new Error('Something went wrong while sending email!');

      logger.info(`${template} email was sent to ${to}!`);

      return sent;
    } catch (e) {
      logger.error('email send failed', { error: e.message });
    }
  }
}
