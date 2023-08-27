import EmailService from '../../../services/email.service.js';
import logger from '../../../utils/logger.js';
import { StatusCodes } from 'http-status-codes';
import { email as envEmail } from '../../../config/env.js';
import axios from 'axios';
import { GITHUB } from '../../../config/env.js';

export async function postContact(req, res) {
  const { email, subject } = req.body;

  if (subject === 'BUG' || subject === 'FEATURE') {
    const data = {
      title: subject,
      body: req.body.message,
      assignees: ['wajeht'],
      labels: [subject.toLowerCase()],
    };

    const config = {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${GITHUB.api_key}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    };

    axios
      .post(GITHUB.issue_url, data, config)
      .then((_response) => {})
      .catch((error) => {
        logger.error(`Something went wrong while sending the issue to GitHub: ${error}`);
      });
  }

  EmailService.send({
    to: envEmail.auth_email,
    subject,
    template: 'contact',
    data: req.body,
  });

  logger.info(`Contact submission was recieved from ${email}`);

  res.status(StatusCodes.CREATED).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was created successfully!',
    data: [{ ...req.body }],
  });
}
