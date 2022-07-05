import nodemailer from 'nodemailer';
import { email } from '../config/env.js';
import Chad from '../libs/chad.js';
import logger from '../libs/logger.js';
import { red } from '../utils/rainbow-log.js';
import Template from '../templates/template.js';

// use https://ethereal.email/ for testing purposes
const transporter = nodemailer.createTransport({
  host: email.host,
  port: email.port,
  auth: {
    user: email.auth_email,
    pass: email.auth_pass,
  },
});

export default class EmailService {
  /**
   * It sends an email to the user with the given data
   */
  static async send({ to, subject, template = 'verify-email', data }) {
    try {
      const sent = await transporter.sendMail({
        from: `"Gains" <${email.auth_email}>`,
        to,
        subject,
        html: Template.generate(template, data),
      });

      if (!sent) throw new Error('Something went wrong while sending email!');
    } catch (e) {
      logger.error(e);
      Chad.flex(e.message, e);
    }
  }
}

// // for testing
// await EmailService.send({
//   to: 'chad@flex.forlife',
//   subject: 'testing',
//   template: 'verify-email',
//   data: {
//     username: 'chad',
//     verificationLink: 'https:/localhost:8080/',
//   },
// });
