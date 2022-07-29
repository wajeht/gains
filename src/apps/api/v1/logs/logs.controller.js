import * as LogsQueries from './logs.queries.js';

export async function createLogs(req, res) {
  const body = req.body;
  const logs = await LogsQueries.createLog(body);
  res.json({
    data: logs,
  });
}
