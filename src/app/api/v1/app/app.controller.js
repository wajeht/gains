import { StatusCodes } from 'http-status-codes';
import axios from 'axios';
import { GITHUB } from '../../../../config/env.js';
import cache from '../../../../utils/cache.js';

export async function getIssues(req, res) {
  let issues = JSON.parse(await cache.get('issues'));

  if (issues === null) {
    issues = await (
      await axios.get(GITHUB.issue_url, {
        headers: {
          Authorization: `Bearer ${GITHUB.api_key}`,
        },
      })
    ).data;
    await cache.set('issues', JSON.stringify(issues), 'EX', 24 * 60 * 60);
  }

  res.status(StatusCodes.OK).json({
    status: 'success',
    request_url: req.originalUrl,
    message: 'The resource was returned successfully!',
    data: issues,
  });
}
