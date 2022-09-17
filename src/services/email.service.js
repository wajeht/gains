import nodemailer from 'nodemailer';
import { email } from '../config/env.js';
import Chad from '../utils/chad.js';
import logger from '../utils/logger.js';
import { red } from '../utils/rainbow-log.js';
import Template from './emails/template.js';

// use https://ethereal.email/ for testing purposes
const transporter = nodemailer.createTransport({
  host: email.host,
  port: email.port,
  auth: {
    user: email.auth_email,
    pass: email.auth_pass,
  },
});

/* Verifying the email service. */
transporter.verify((error, success) => {
  if (error) {
    logger.error(error);
    Chad.flex(error.message, error);
  } else {
    logger.info('Email service started!.');
  }
});

export default class EmailService {
  /**
   * It sends an email to a user
   * @returns The sent email
   * @params files {Object}
   */
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

      // mail action
      const sent = await transporter.sendMail(mail);

      if (!sent) throw new Error('Something went wrong while sending email!');

      return sent;
    } catch (e) {
      logger.error(e);
      Chad.flex(e.message, e);
    }
  }
}

// // for testing purpose
// await EmailService.send({
//   to: 'chad@flex.forlife',
//   subject: 'testing',
//   template: 'verify-email',
//   data: {
//     username: 'chad',
//     verificationLink: 'https:/localhost:8080/',
//   },
// });
