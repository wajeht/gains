import nodemailer from 'nodemailer';
import { email } from '../config/env.js';
import Chad from '../utils/chad.js';
import logger from '../utils/logger.js';
import Template from './emails/template.js';
import emailConfig from '../config/mail.config.js';

// use https://ethereal.email/ for testing purposes
const transporter = nodemailer.createTransport(emailConfig);

transporter.verify((error, _success) => {
  if (error) {
    logger.error(error);
    Chad.flex(error.message, error);
  } else {
    logger.info('Email service started!.');
  }
});

export default class EmailService {
  static async send({ to, subject, template = 'verify-email', data, files }) {
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
      logger.error(e);
      Chad.flex(e.message, e);
    }
  }
}
