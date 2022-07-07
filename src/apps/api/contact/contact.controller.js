import EmailService from '../../../services/email.service.js';
import logger from '../../../libs/logger.js';
import { StatusCodes } from 'http-status-codes';
import { email as envEmail } from '../../../config/env.js';

/**
 * It sends an email to the user with the data they submitted
 * @param req - The request object.
 * @param res - The response object.
 */
export async function postContact(req, res) {
  const { email, subject } = req.body;
  await EmailService.send({
    to: envEmail.auth_email,
    subject,
    template: 'contact',
    data: req.body,
  });

  logger.info(`Contact was recieved from ${email}`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: [{ ...req.body }],
  });
}
