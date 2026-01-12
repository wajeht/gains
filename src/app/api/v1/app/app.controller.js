import { StatusCodes } from 'http-status-codes';
import axios from 'axios';
import { GITHUB } from '../../../../config/env.js';

export async function getIssues(req, res) {
  const issues = await axios.get(GITHUB.issue_url, {
    headers: {
      Authorization: `Bearer ${GITHUB.api_key}`,
    },
  });

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: issues.data,
  });
}
