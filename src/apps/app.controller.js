import path from 'path';

/**
 * It returns a 200 status code with a JSON object containing a message
 * @param req - The request object.
 * @param res - The response object.
 */
export function getHealthCheck(req, res) {
  res.status(200).json({
    msg: 'ok',
  });
}

/**
 * It sends the index.html file to the browser
 * @param req - The request object.
 * @param res - The response object.
 * @returns The index.html file from the public folder.
 */
export function vueHandler(req, res, next) {
  try {
    res.sendFile(path.resolve(path.join(process.cwd(), "src", "public", "index.html"))); // prettier-ignore
  } catch (error) {
    next(error);
  }
}

export function notFoundHandler(req, res, next) {}

export function errorHandler(err, req, res, next) {}
